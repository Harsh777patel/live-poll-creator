const mongoose = require("../connection");
const { Schema, model } = mongoose;

const mySchema = new Schema({
  title: String,
  name: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("rooms", mySchema);