var mongoose = require('mongoose');
require('mongoose-type-url');


const ProductSchema = new mongoose.Schema({
  
  modelNo: {
    type: Number,
    required: "Cannot enter a product without model number, please enter model number of the product",
    unique: [true, "Custom unique failed"]
  },

  brand: {
    type: String,
    required: "Cannot enter a product without brand, please enter brand of the product"
  },

   name: {
     type: String,
     required: "Cannot enter a product without name, please enter product name"
   }, 

   quantity: {
     type: Number,
     required: "Cannot enter a product without quantity, please enter product quantity",
     min: 0
   }, 

   oldprice: {
      type: Number,
     required: "Cannot enter a product without old-price, please enter price of the old-product " 

   },
   
   price: {
     type: Number,
     required: "Cannot enter a product without price, please enter price of the product "   
   },

   discount: {
     type: Number
   },

     rating: {
     type: Number,
     required: "Cannot enter a product without rating, please enter rating of the product "   
   },

     star: {
     type: Number,
     required: "Cannot enter a product without stars, please enter stars of the product "   
   },

     img: {
     type: mongoose.SchemaTypes.Url,
     required: "Cannot enter a product without imgUrl, please enter imgUrl of the product "   
   },
   
  //  url : {
  //    type: mongoose.SchemaTypes.Url,
  //    required:  "Cannot enter a product without URL, please enter URL of the product",
  //  }, 
   description : {
     type: String,
     minLength : [50 , "Description must be 50 characters or more"]
   }, 

   inStock : {
     type: Boolean
   },

   gender: {
     type: "String"
   },

   fastDelivery: {
     type: Boolean,
   }


}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
   
  });

const Product = mongoose.model("Product", ProductSchema);

// add products to database:
const addProductsToDB = () => {
  products.forEach(async (product) => {
    const NewProduct = new Product(product);
    const savedProduct = await NewProduct.save();
  })
}

module.exports = { Product, addProductsToDB }