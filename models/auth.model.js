const mongoose = require("mongoose");
const { Schema } = mongoose;

const AuthSchema = new Schema(
  {
    createdAt: Number,
    updatedAt: Number,
    username: {
      type: String,
      required: [true, "Please add your Username"],
      unique: "Username should be unique",
    },
    email: {
      type: String,
      required: [true, "Please enter your Email ID"],
      unique: "EmailID should be unique",
    },
    password: {
      type: String,
      required: [true, "Please Enter your password"],
    },
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

const Auth = mongoose.model("Auth", AuthSchema);

module.exports = { Auth };
