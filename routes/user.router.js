const express = require('express');
const router = express.Router();
const { extend } = require("lodash");
const { User } = require("../models/user.model");
const { populateData } = require("../utils")
const { users, auth } = require("../utils");

// router.route("/user-details")


router.get("/", async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json(
        { success: false, errorMessage: "unable to find user" });
    }

    const currentUser = await user.populate(['cart.productId'])
    
    const currentUserWish = await user.populate(['wishlist.productId']);

    const object = populateData(currentUser.cart)

      return res.status(200).json({ user: { ...user._doc, cart: object, wishlist: currentUserWish.wishlist }, success: true, message: "Successful" })

  } catch (error) {
    res.status(500).json({ success: false, message: "Couldn't get user details", errorMessage: error.message })
  }
})

router.route("/cart")
  .get(async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ success: false, message: "unable to find user" });
      }

      const currentUser = await user.populate(['cart.productId']);

      const object = populateData(currentUser.cart)

      return res.status(200).json({ cart: object, success: true, message: "Success" })

    } catch (error) {
      res.status(500).json({ success: false, message: "Couldn't get cart details", errorMessage: error.message })
    }

  })
  .post(async (req, res) => {
    try {
      const { userId } = req.user;

      const user = await User.findById(userId);

      const productId = req.body;
      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }

      user.cart.push({ productId: productId.id, quantity: 1 });

      const savedProduct = await user.save();

      const updatedObj = await savedProduct.populate([{ path: 'cart.productId', select: 'name image price inStock offer' }]);

      const object = populateData(updatedObj.cart)

      return res.status(201).json({ cart: object, success: true, message: "Successful" });

    } catch (error) {
      res.status(500).json({ success: false, message: "Couldn't add item to cart", errorMessage: error.message })
    }
  })

router.route("/wishlist")
  .get(async (req, res) => {

    const { userId } = req.user;
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }

      const currentUser = await user.populate(['wishlist.productId']);

      return res.status(200).json({ wishlist: currentUser.wishlist, success: true, message: "Success" });

    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "couldn't get wishList details", errorMessage: error.message })
    }

  })
  .post(async (req, res) => {
    const { userId } = req.user;
    try {
      const user = await User.findById(userId);

      const productId = req.body;

      if (!user) {
        return res.status(400).json({ success: false, errorMessage: "unable to find user" });
      }

      user.wishlist.push({ productId: productId.id });

      const savedProduct = await user.save();

      const updatedObj = await savedProduct.populate(['wishlist.productId']);

      return res.status(201).json({ wishlist: updatedObj.wishlist, success: true, message: "Successful" });

    } catch (error) {

      res.status(500).json({ success: false, errorMessage: "Error while add item to cart", errorMessage: error.message })
    }
  })

router.route("/cart/:productId")
  .post(async (req, res) => {

    const { productId } = req.params;
    const updateProduct = req.body;
    const { userId } = req.user;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ success: false, message: "unable to find user" });
      }

      const product = user.cart.find(item => item.productId == productId)

      if (!product) {
        return res.status(404).json({ success: false, errorMessage: "The product id you requested doesn't exist" })
      }

      const newProduct = extend(product, updateProduct);

      await user.save();

      return res.status(200).json({ product: newProduct, success: true, message: "Product Updated Successfully" })

    } catch (error) {
      res.status(500).json({ success: false, message: "Error while updating cart", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    const { productId } = req.params;
    const { userId } = req.user;
    
    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ success: false, message: "unable to find user" });
      }

      const product = user.cart.find(item => item.productId == productId);

      if (!product) {
        return res.status(404).json({ succes: false, message: "The product id you requested doesn't exists" });
      }

      user.cart.pull({ _id: product._id });

      await user.save();

      return res.status(200).json({ cart: user.cart, success: true, message: "Successful" });

    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Error while deleting item from cart", errorMessage: error.message })
    }
  })

router.delete("/wishlist/:productId", async (req, res) => {

  const { productId } = req.params;
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ success: false, message: "unable to find user" });
    }

    const product = user.wishlist.find(item => item.productId == productId)

    if (!product) {
      return res.status(404).json({ succes: false, message: "The product id you requested doesn't exists" });
    }

    user.wishlist.pull({ _id: product._id });

    await user.save();

    return res.status(200).json({ wishlist: user.wishlist, success: true, message: "Successful" });
    
  } catch (error) {
    res.status(500).json({ success: false, message: "Couldn't delete item from wishList", errorMessage: error.message })
  }
})

router.route("/address")
  .get(async (req, res) => {

    const { userId } = req.user;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ success: false, message: "unable to find user" });
      }

      return res.status(200).json({ addresses: user.addresses, success: true, message: "Success" })

    } catch (error) {
      res.status(500).json({ success: false, message: "Error while retrieving addresses", errorMessage: error.message })
    }

  })
  .post(async (req, res) => {
    const { newAddress } = req.body;
    const { userId } = req.user;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ success: false, message: "unable to find user" });
      }

      user.addresses.push(newAddress);

      const updatedUser = await user.save();

      const newAddressFromDB = updatedUser.addresses.find((item) => item.phoneNumber == newAddress.phoneNumber);

      return res.status(201).json({ address: newAddressFromDB, success: true, message: "Successful" });

    } catch (error) {
      res.status(500).json({ success: false, message: "couldn't add address", errorMessage: error.message })
    }
  })

router.route("/address/:addressId")
  .post(async (req, res) => {

    const { addressId } = req.params;
    const updateAddress = req.body;
    const { userId } = req.user;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ success: false, message: "unable to find user" });
      }
      const address = user.addresses.find(item => item._id == addressId)

      if (!address) {
        return res.status(404).json({ success: false, message: "The address id you requested doesn't exist" });
      }

      const newAddress = extend(address, updateAddress.updateAddress);
      await user.save();

      return res.status(200).json({ address: newAddress, success: true, message: "Address Updated Successfully" })

    } catch (error) {
      res.status(500).json({ success: false, message: "Error while updating address", errorMessage: error.message })
    }
  })
  .delete(async (req, res) => {
    
    const { addressId } = req.params;
    const { userId } = req.user;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ success: false, message: "unable to find user" });
      }

      const address = user.addresses.find(item => item._id == addressId)
      if (!address) {
        return res.status(404).json({ succes: false, message: "The address id you requested doesn't exists" });
      }

      user.addresses.pull({ _id: address._id });

      await user.save();
      return res.status(200).json({ addresses: user.addresses, success: true, message: "Successful" });

    } catch (error) {
      res.status(500).json({ success: false, message: "Error while deleting address", errorMessage: error.message })
    }
  })
  

module.exports = router;