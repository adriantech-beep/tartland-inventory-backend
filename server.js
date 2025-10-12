import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import materialRoutes from "./routes/materialRoutes.js";
import mixtureRuleRoutes from "./routes/mixtureRuleRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import productionLogRoutes from "./routes/productionLogRoutes.js";
import producedInventoryRoutes from "./routes/producedInventoryRoutes.js";
import inboundRoutes from "./routes/inboundRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import availableStockRoutes from "./routes/availableStockRoutes.js";
import authGoogleRoutes from "./routes/authGoogleRoutes.js";
import authUserRoutes from "./routes/authUserRoutes.js";
import activeUserRoutes from "./routes/activeUserRoutes.js";

const app = express();
connectDB();

app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://tartland-inventory-system.vercel.app",
  "https://tartland-inventory-system-git-main-adriantech-beeps-projects.vercel.app",
  "https://tartland-inventory-system-j13gki3x8-adriantech-beeps-projects.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS: ", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authGoogleRoutes);

app.use("/api/auth", authUserRoutes);

app.use("/api/materials", materialRoutes);

app.use("/api/mixture-rules", mixtureRuleRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/production-log", productionLogRoutes);

app.use("/api/inventory-produced", producedInventoryRoutes);

app.use("/api/inbound-log", inboundRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/available-stock", availableStockRoutes);

app.use("/api/user", activeUserRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
