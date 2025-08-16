const Registration = require("../models/registrationModel");

exports.createRegistration = async (req, res) => {
  try {
    const { name, mobile, email, college, degree, year } = req.body;

    // Basic presence check for required fields
    if (!name || !mobile || !email || !college || !degree || !year) {
      return res.status(400).json({
        message:
          "All fields (name, mobile, email, college, degree, year) are required.",
      });
    }

    // normalize mobile: remove non-digits
    const normalizedMobile = String(mobile).replace(/\D/g, "");

    // validate 10-digit mobile
    if (!/^\d{10}$/.test(normalizedMobile)) {
      return res
        .status(400)
        .json({ message: "Mobile No must be a 10-digit number." });
    }

    const rawEmail = String(email || "").trim();
    // ensure user provided lowercase email exactly as-is
    if (rawEmail !== rawEmail.toLowerCase()) {
      return res
        .status(400)
        .json({ message: "Please enter the email in lowercase only." });
    }
    // simple, robust email pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    const normalizedEmail = rawEmail; // already lowercase

    // create & save
    const doc = new Registration({
      name: name.trim(),
      mobile: normalizedMobile,
      email: normalizedEmail,
      college: String(college).trim(),
      degree: String(degree).trim(),
      year: String(year).trim(),
    });

    const saved = await doc.save();
    return res.status(201).json({ message: "Registered", data: saved });
  } catch (err) {
    // duplicate key error (unique violation)
    if (err.code === 11000) {
      // err.keyPattern or err.keyValue may indicate which field
      const dupField = err.keyPattern
        ? Object.keys(err.keyPattern)[0]
        : err.keyValue
        ? Object.keys(err.keyValue)[0]
        : null;
      if (dupField === "mobile") {
        return res
          .status(409)
          .json({ message: "Mobile number already registered." });
      }
      if (dupField === "email") {
        return res.status(409).json({ message: "Email already registered." });
      }
      return res
        .status(409)
        .json({ message: "Duplicate value", field: dupField || null });
    }

    console.error("Create registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
