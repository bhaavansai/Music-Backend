// controllers/registrationController.js
const Registration = require("../models/registrationModel");

exports.createRegistration = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    // basic presence check
    if (!name || !mobile) {
      return res.status(400).json({ message: "Name and mobile are required." });
    }

    // normalize mobile: remove non-digits
    const normalizedMobile = String(mobile).replace(/\D/g, "");

    // validate 10-digit mobile
    if (!/^\d{10}$/.test(normalizedMobile)) {
      return res
        .status(400)
        .json({ message: "Mobile must be a 10-digit number." });
    }

    // create & save
    const doc = new Registration({
      name: name.trim(),
      mobile: normalizedMobile,
    });
    const saved = await doc.save();

    return res.status(201).json({ message: "Registered", data: saved });
  } catch (err) {
    // duplicate key error (unique violation)
    if (err.code === 11000 && err.keyPattern && err.keyPattern.mobile) {
      return res
        .status(409)
        .json({ message: "Mobile number already registered." });
    }
    console.error("Create registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
