const asyncHandler = require("express-async-handler");
const musicSheet = require("../models/musicSheetsModel");

// @desc Get all music sheets
//@route GET /music-sheets
//@access public
const getMusicSheets = asyncHandler(async (req,res) =>{
    const sheets = await musicSheet.find();
    res.status(200).json(sheets);
});

module.exports = {getMusicSheets};