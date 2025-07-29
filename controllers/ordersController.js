import { validationResult } from "express-validator";
import Orders from "../models/Orders.js";
import HttpError from "../models/HttpError.js";
import Stock from "../models/Stock.js";

export const createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data submitted", 422));
  }

  const { customerName, flavorName, bundleCount } = req.body;

  try {
    const stock = await Stock.findOne({ flavor: flavorName });

    if (!stock) {
      return next(
        new HttpError(`No stock record found for ${flavorName}`, 404)
      );
    }

    if (stock.availableBundles < bundleCount) {
      return res.status(422).json({
        message: `Insufficient stock for ${flavorName}. Only ${stock.availableBundles} bundles available.`,
      });
    }

    const newOrder = new Orders({
      customerName,
      flavorName,
      bundleCount,
    });

    await Stock.findOneAndUpdate(
      { flavor: flavorName },
      { $inc: { availableBundles: -bundleCount } }
    );

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    return next(new HttpError("Creating order failed.", 500));
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const mixture = await Orders.find();

    const formatted = mixture.map((prod) => prod.toObject({ getters: true }));
    res.status(200).json({ orders: formatted });
  } catch (err) {
    const error = new HttpError("Fetching orders failed", 500);
    return next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  const orderId = req.params.id;

  try {
    const order = await Orders.findById(orderId);

    if (!order) {
      return next(new HttpError("Order not found.", 404));
    }

    await Stock.findOneAndUpdate(
      { flavor: order.flavorName },
      { $inc: { availableBundles: order.bundleCount } }
    );

    await Orders.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order cancelled and stock restored." });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Deleting order failed.", 500));
  }
};

export const editOrder = async (req, res, next) => {
  const { id } = req.params;
  const { customerName, flavorName, bundleCount } = req.body;

  try {
    const existingOrder = await Orders.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousBundleCount = bundleCount;
    const previousFlavor = flavorName;

    await Stock.findOneAndUpdate(
      { flavor: previousFlavor },
      { $inc: { availableBundles: previousBundleCount } }
    );

    await Stock.findOneAndUpdate(
      { flavor: flavorName },
      { $inc: { availableBundles: -bundleCount } }
    );

    existingOrder.customerName = customerName;
    existingOrder.flavorName = flavorName;
    existingOrder.bundleCount = bundleCount;

    await existingOrder.save();

    res.status(200).json(existingOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update order" });
  }
};
