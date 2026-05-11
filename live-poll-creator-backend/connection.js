const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGO_URI;

if (!url) {
  console.error("❌ MONGO_URI not defined");
  process.exit(1);
}

mongoose
  .connect(url)
  .then(() => {
    console.log("✅ DB Connected successfully");
  })
  .catch((err) => {
    console.error("❌ DB Connection failed:", err.message);
    process.exit(1);
  });

module.exports = mongoose;