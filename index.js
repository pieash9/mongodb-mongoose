const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// middleware
app.use(express.json()); //  for send json data
app.use(express.urlencoded({ extended: true }));

//create product schema
const productsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
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

// find all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({ price: { $gt: 45 } });
    if (products) {
      res.status(200).send(products);
    } else {
      res.status(404).send({ message: "Products not found!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// get specific product data
app.get("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne();
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: "Product not found!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// post product data
app.post("/products", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = new Product({ ...product });
    const productData = await newProduct.save();
    res.status(200).send(productData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.listen(port, async () => {
  console.log(`server is running at port ${port}`);
  await connectDB();
});

app.get("/", (req, res) => {
  res.send("Welcome to home page");
});
