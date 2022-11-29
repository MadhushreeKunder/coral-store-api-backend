const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model");
const { extend } = require("lodash")

router.route("/")
.get( async (req, res) => {
  try {
    const products = await Product.find();  
      res.json({ products, success: true })

  } catch (err) {
    res.status(500).json({ success: false, message: "unable to get products", errMessage: err.message})
  }
})
// .post(async (req, res) => {
//   try {
//     const product = req.body
//     const NewProduct = new Product(product);
//     const savedProduct = await NewProduct.save();
//     res.status(201).json({ success: true, product: savedProduct })
//   } catch(err) {
//     res.status(500).json({ success: false, message: "unable to add products", errMessage: err.message})
//   }
// })



router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({success: false , message: "Product not found"})
    }
    req.product = product;
    next();
  } catch {
    res.status(400).json({success: false, message: "Could not retrieve product"})
  }
})



router.route("/:id")
.get(async(req, res) => {
  const { product } = req
  const { id } = req.params;

  try {
    let product = await Product.findById(id);
    product.__v = undefined;
    if (product) {
      return res.status(200).json({ product, success: true, message: "Successful" })
    } res.status(404).json({ success: false, errorMessage: "The product ID sent has no product associated with it. Check and try again" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong", errorMessage: error.message })
  }

})
// .post( async(req, res) => {
//   let { product } = req;
//   const productUpdate = req.body;

//   product = extend(product, productUpdate);
//   product.updated = Date.now();
//   console.log("date: ", product.updated);
//   product = await product.save();

//   res.json({success: true, product})
 
// })
// .delete( async (req, res) =>  {
//   let { product } = req;
//   await product.remove();
//   res.json({success: true, product})
// })


module.exports = router



