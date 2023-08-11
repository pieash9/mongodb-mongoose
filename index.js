const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;

// middleware
app.use(express.json()); //  for send json data
app.use(express.urlencoded({ extended: true }));

//create product schema
const productsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
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
  },
  { versionKey: false }
);

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
    const price = req.query.price;
    const rating = req.query.rating;
    let products;
    if (price && rating) {
      products = await Product.find({
        $or: [{ price: { $gt: price } }, { rating: { $gt: rating } }],
      }).sort({ price: 1 });
    } else {
      products = await Product.find().sort({ price: -1 });
    }
    if (products.length == 0) {
      res.status(400).send({ message: "product not found" });
    }
    res.status(200).send(products);
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

app.put("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const title = req.body.title;
    const price = req.body.price;
    const rating = req.body.rating;
    const description = req.body.description;
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title: title,
          price: price,
          rating: rating,
          description: description,
        },
      },
      { new: true }
    );
    if (updatedProduct) {
      res.status(200).send({
        success: true,
        message: "product updated",
        data: updatedProduct,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "product was not updated",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  const id = req.params.id;
  const result = await Product.findByIdAndDelete({ _id: id });
  res.send(result);
});

app.listen(port, async () => {
  console.log(`server is running at port ${port}`);
  await connectDB();
});

app.get("/", (req, res) => {
  res.send("Welcome to home page");
});
