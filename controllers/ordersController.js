import { validationResult } from "express-validator";
import Orders from "../models/Orders.js";
import HttpError from "../models/HttpError.js";

export const createOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data submitted", 422));
  }

  const { customerName, flavorName, orderCount } = req.body;

  try {
    const newOrder = new Orders({
      customerName,
      flavorName,
      orderCount,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Creating orders failed.", 500));
  }
};
