import express from "express";
import "dotenv/config"; // to read .env file
import cors from "cors"; // to allow cross-origin requests

// Routes
import categoryRoute from "./routes/Category";
import subcategoryRoute from "./routes/SubCategory";
import itemRoute from "./routes/Item";

const app = express(); // create express app

// Middleware
app.use(cors()); // to allow cross-origin requests
app.use(express.json()); // to accept json data

// Routes
app.get("/", (_req, res) => {
  res.status(200).send("Server is running!"); // default route
});

app.use("/api", categoryRoute); // to use category route
app.use("/api", subcategoryRoute); // to use subcategory route
app.use("/api", itemRoute); // to use item route

export default app;