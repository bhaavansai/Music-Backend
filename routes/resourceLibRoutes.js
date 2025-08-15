const express =require("express");
const router=express.Router();
const {getMusicSheets} = require("../controllers/resourceLibController");
const validateToken = require("../middleware/validateTokenHandler");

router.get("/music-sheets",getMusicSheets);

module.exports = router; 