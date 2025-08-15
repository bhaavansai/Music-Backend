// routes/registration.js
const express = require("express");
const router = express.Router();
const { createRegistration } = require("../controllers/registrationController");

// POST /api/registration
router.post("/", createRegistration);

module.exports = router;
