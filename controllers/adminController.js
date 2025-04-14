const asyncHandler = require('express-async-handler');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require("../models/schema/studentSchema")
//@desc Login the admin
//@route POST /admin/login
//@access Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { mobilenumber, password } = req.body;

  // 1️⃣ Validate required fields
  if (!mobilenumber || !password) {
    return res.status(400).json({ message: "Mobile number and password are required" });
  }

  // 2️⃣ Find admin by mobile number
  const admin = await Admin.findOne({ mobilenumber });
  if (!admin) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 3️⃣ Validate password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 4️⃣ Generate JWT token (valid for 7 days)
  const token = jwt.sign(
    { admin: { id: admin._id, mobilenumber: admin.mobilenumber, username: admin.username, role: "admin" } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // 5️⃣ Send response with token and admin details
  res.status(200).json({
    message: "Login successful",
    admin: {
      id: admin._id,
      username: admin.username,
      mobilenumber: admin.mobilenumber,
      role: "admin",
    },
    token,
  });
});

//########################################################33
 //to search the free trial clienrts 
 const searchInNewStudentsAPI = asyncHandler(async (req, res) => {
  try {
    const query = req.query.q?.trim() || '';
    const status = req.query.status?.trim(); // Optional status filter

    if (typeof query !== 'string') {
      return res.status(400).json({ message: 'Invalid query parameter' });
    }

    const searchRegex = new RegExp(query, 'i');

    const searchConditions = {
      $or: [
        { studentID: searchRegex },
        { name: searchRegex },
        { phone: searchRegex },
        { category: searchRegex }
      ]
    };

    // Add status filter only if it's provided
    if (status) {
      searchConditions.status = status;
    }

    const students = await Student.find(searchConditions).sort({ registeredAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = { loginAdmin, searchInNewStudentsAPI };
