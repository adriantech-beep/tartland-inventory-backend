// server.js or index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import materialRoutes from "./routes/materialRoutes.js";
import mixtureRuleRoutes from "./routes/mixtureRuleRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import productionLogRoutes from "./routes/productionLogRoutes.js";
import producedInventoryRoutes from "./routes/producedInventoryRoutes.js";
import inboundRoutes from "./routes/inboundRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/materials", materialRoutes);

app.use("/api/mixture-rules", mixtureRuleRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/production-log", productionLogRoutes);

app.use("/api/inventory-produced", producedInventoryRoutes);

app.use("/api/inbound-log", inboundRoutes);

app.use("/api/orders", orderRoutes);

app.use(
  cors({
    origin:
      "https://tartland-inventory-system-az7to49hu-adriantech-beeps-projects.vercel.app",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
