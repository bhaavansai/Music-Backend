// routes/registration.js
const express = require("express");
const router = express.Router();
const {
  createRegistration,
  getRegistrations,
} = require("../controllers/registrationController");

// POST /api/registration
router.post("/", createRegistration);

// GET /api/registration/all
router.get("/all", getRegistrations);

module.exports = router;
