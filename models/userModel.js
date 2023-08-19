const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Name is Required."],
    },
    email: {
      type: String,
      required: [true, "Email is Required."],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please provide a valid Email.",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is Required."],
      minLength: [6, "Password must contain atleast 6 characters."]
    },
    token: {
      type : String
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User",userSchema)

module.exports = User;