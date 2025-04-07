const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tutor = require("../models/tutorModel");

// @desc register a tutor
//@route POST /teach
//@access public
const registerTutor = asyncHandler(async (req, res) => {
    try {
      const {
        name,
        phone,
        email,
        gender,
        qualification,
        englishProficiency,
        teachingExperience,
        certification,
        homeSetup,
        skills,
        timezone,
      } = req.body;
  
      // Creating a new tutor request with default values for availableTimes and freeTrial
      const newTutor = new Tutor({
        username:name,
        mobilenumber:phone,
        email,
        gender,
        qualification,
        englishProficiency,
        teachingExperience,
        certification,
        homeSetup,
        skills,
        timezone,
        availableTimes: [], // Initially empty
        freeTrial: "not eligible", // Default value
      });
  
      await newTutor.save();
      res.status(201).json({ message: "Tutor request submitted successfully", tutor: newTutor });
    } catch (error) {
      console.error("Error registering tutor:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });

//@desc Login the tutor
//@route POST /tutor/login
//@access Public
const loginTutor = asyncHandler(async (req, res) => {
  const { mobilenumber, password } = req.body;

  // 1️⃣ Validate required fields
  if (!mobilenumber || !password) {
    return res.status(400).json({ message: "Both mobile number and password are required" });
  }

  // 2️⃣ Fetch tutor details by mobile number
  const tutor = await Tutor.findOne({ mobilenumber });
  if (!tutor) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 3️⃣ Validate password using bcrypt
  const isPasswordValid = await bcrypt.compare(password, tutor.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 4️⃣ Generate JWT token (valid for 7 days)
  const token = jwt.sign(
    { tutor: { mobilenumber: tutor.mobilenumber, id: tutor._id, role: "tutor" } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // 5️⃣ Send response with token and tutor details
  res.status(200).json({
    message: "Login successful",
    tutor: {
      id: tutor._id,
      username: tutor.username,
      mobilenumber: tutor.mobilenumber,
      role: "tutor",
      // add additional fields if needed
    },
    token,
  });
});

  
  module.exports = { registerTutor,loginTutor };