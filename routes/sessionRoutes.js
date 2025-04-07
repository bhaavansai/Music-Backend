const express =require("express");
const router=express.Router();
const {getFutureSessions} = require("../controllers/sessionsController");

router.route("/future-sessions").get(getFutureSessions);
module.exports = router;