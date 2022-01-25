const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { initialiseDBConnection } = require("./db/db.connect.js")

require('dotenv').config();


 
const { authVerify } = require("./middlewares/auth.handler.middleware")
const { errorHandler } = require("./middlewares/error-handler.middleware")
const { routeNotFound } = require("./middlewares/route-not-found.middleware")

const { addProductsToDB } = require("./models/product.model");
const { addAuthToDB } = require("./models/auth.model");
const { addUserToDB } = require("./models/user.model");

const productsV1 = require("./routes/products.router");
const auth = require("./routes/auth.router");
const user = require("./routes/user.router");

// 61ed7585ebe6ce2757255621
const PORT = process.env.PORT || 5001;

const app = express();

app.use(cors());

app.use(bodyParser.json());

initialiseDBConnection();

app.use('/products', productsV1);
app.use('/auth', auth);
app.use('/user-details', authVerify, user);


app.get("/" , (req, res) => {
  res.json({hello: "world"})
})


app.use(routeNotFound);
app.use(errorHandler)


app.listen(PORT, ()=>{
  console.log("Server started on PortNo: ", PORT)
})
