const mongoose = require("mongoose");


const tutorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mobilenumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  qualification: { type: String, required: true },
  englishProficiency: { type: String, required: true },
  teachingExperience: { type: String, required: true },
  certification: { type: String, required: true },
  homeSetup: { type: String, required: true },
  skills: [
    {
      skill: { type: String, required: true },
      level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    },
  ],
  timezone: { 
    type: String, 
    required: true, 
    enum: Intl.supportedValuesOf('timeZone') // Ensures only valid IANA time zones
  },
  status: { type: String, enum: ["approved", "pending", "rejected"], default: "pending" },
  freeTrial: { type: String, enum: ["eligible", "not eligible"], default: "not eligible" },
  availableTimes: { 
    type: [String], // Store times in UTC using ISODate format
    default: [] 
  },
  freeTrialCount: {
    type: Number,
    min: 0, // Optional: ensure the count is non-negative
    default: 0, // Optional: set a default value
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  password: {
    type: String,
    required: false, // Password is not required at the time of registration
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

module.exports = mongoose.model("Tutor", tutorSchema);
