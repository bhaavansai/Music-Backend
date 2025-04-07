const asyncHandler = require("express-async-handler");
const FutureSession = require("../models/sessionModel");

// @desc get the upcoming sessions for the user
//@route GET /future-sessions
//@access private

const getFutureSessions = asyncHandler(async (req, res) => {
    const { mobilenumber } = req.query;
    const futureSessions = await FutureSession.find({ userMobileNo: mobilenumber }).sort({ sessionDateTime: 1 });
    
    if (!futureSessions || futureSessions.length === 0) {
      return res.status(404).json({ message: "No upcoming sessions found" });
    }
    
    res.status(200).json({ futureSessions });
  });
  

module.exports = { getFutureSessions };