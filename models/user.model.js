const mongoose = require('mongoose');
const { users } = require("../utils.js");
const { Schema } = mongoose;

const UserSchema = new Schema({
  
  _id: { type: Schema.Types.ObjectId, ref: 'Auth' },
  
  wishList: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product' } }],

  cart: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' }, 
    quantity: Number
  }],

  addresses: [
    {
      name: {
        type: String,
        required:'Please add your name',
      },
      phoneNumber: {
        type: Number,
        required:'Please add your Phone Number',
      },
      pinCode: {
        type: Number,
        required:'Please add your pin code',
      },
      city: {
        type: String,
        required:'Please add your city',
      },
      address: {
        type: String,
        required:'Please add your address',
      },
      state: {
        type: String,
        required:'Please add your start',
      },
      country: {
        type: String,
        required:'Please add your Country',
      },
     
    }
  ]
}, {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }
   
  });

const User = mongoose.model('User', UserSchema);

const addUserToDB = () => {
  users.forEach(async (user) => {
    const NewUser = new User(user);
    const savedUser = await NewUser.save();
    console.log(savedUser);
  })
}


module.exports = { User, addUserToDB };