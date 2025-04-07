const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminModel"); // adjust the path as needed

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://bhaavan:harekrishna8899@harekrishna.7awiq.mongodb.net/music_backend?retryWrites=true&w=majority&appName=harekrishna"); // or replace with direct URI

    const password = "12345678";
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username: "Dishank",
      mobilenumber: "+919876543211",
      password: hashedPassword,
      gender: "Male",
      timezone: "Asia/Calcutta",
    });

    const savedAdmin = await newAdmin.save();
    console.log("Admin created:", savedAdmin);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();
