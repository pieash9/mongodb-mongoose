const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

//create product schema
const productsSchema = mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// create product model
const Product = mongoose.model("Products", productsSchema);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/testProductDB");
    console.log("DB is connected");
  } catch (error) {
    console.log("DB is not connected");
    console.log(error.message);
    process.exit(1);
  }
};

app.listen(port, async () => {
  console.log(`server is running at port ${port}`);
  await connectDB();
});

app.get("/", (req, res) => {
  res.send("Welcome to home page");
});
