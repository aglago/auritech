import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import invoiceRoutes from "./routes/invoice.routes.js";
import draftRoutes from "./routes/draft.routes.js";
import connectDB from "./db/connectToDB.js";
import connectToDB from "./db/connectToDB.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/drafts", draftRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectToDB();
});
