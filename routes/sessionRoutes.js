const express =require("express");
const router=express.Router();
const {getFutureSessions} = require("../controllers/sessionsController");
const validateToken = require("../middleware/validateTokenHandler");

router.get("/future-sessions",getFutureSessions);
module.exports = router;