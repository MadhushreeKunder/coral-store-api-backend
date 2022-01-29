const jwt = require("jsonwebtoken");
const jwt_secret = process.env['JWT_SECRET'];
const { Auth } = require('./models/auth.model')

// const findUserByUserName = (username) => {
//   return Auth.findOne({username: username }, function(err, user) {
//     if (err) { console.log(err.response)};
//   })
//   // .clone().catch(function(err){console.log(err)})
// };

const findUserByUserName = (username) => {
return Auth.findOne({username: username});
}

// const findUserByUserName = (username) => {
//   return Auth.findOne({ username: new RegExp('^' + username + '$', "i") }, function(err, user) {
//     if (err) return console.log(err);
//   })
// };


const generateToken = (userId) => {
  return jwt.sign({ userId }, jwt_secret, { expiresIn: '24h' });
}

const populateData = (cart) => {
  return cart.map((item) => {
    const { _id, productId, quantity } = item;
    return { _id, productId: { ...productId.toJSON(), quantity } }
  });
}


const users = [
  {
    _id: "61ed7585ebe6ce2757255621",
    wishList: [],
    cart: [],
  },
]

const auth = [
  {
    username: "admin",
    email: "admin@gmail.com",
    password: "admin",
  },
];

module.exports = { findUserByUserName, generateToken,populateData, 
users, auth
 }