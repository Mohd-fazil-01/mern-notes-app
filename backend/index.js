import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";

dotenv.config();

db(); // yahi call kar

const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));