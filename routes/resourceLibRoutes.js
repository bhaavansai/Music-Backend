const express =require("express");
const router=express.Router();
const {getMusicSheets} = require("../controllers/resourceLibController");

router.route("/music-sheets").get(getMusicSheets);

module.exports = router; 