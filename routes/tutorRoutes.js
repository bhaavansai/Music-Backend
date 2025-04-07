const express = require("express");
const { registerTutor, loginTutor } = require("../controllers/tutorController");
const router = express.Router();

router.post("/teach", registerTutor);
router.post("/tutor/login", loginTutor);
module.exports = router;