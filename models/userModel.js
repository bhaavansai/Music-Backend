const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  mobilenumber: {
    type: String,
    required: [true, "Please add mobile number"],
    unique: [true, "Mobile number already taken"],
  },
  username: {
    type: String,
    required: [true, "Please add the user name"],
  },
  gender: {
    type: String,
    required: [true, "Please specify gender"],
    //enum: ["male", "female", "I Don't Prefer to Tell"], // Optional: Restrict values
  },
  agegroup: {
    type: String,
    required: [true, "Please specify age group"],
  },
  category: {
    type: [String], // Can store multiple values
    required: [true, "Please specify at least one category"],
  },
  emailID: {
    type: String,
    required: [true, "Please add an email ID"],
    unique: [true, "Email ID already taken"],
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  timezone: {
    type: String,
    required: [true, "Please select a timezone"],
  },
}, { timestamps: true }); // Adds createdAt & updatedAt fields

module.exports = mongoose.model("User",userSchema);