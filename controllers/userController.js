const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const FutureSession = require("../models/sessionModel");
const { createGoogleMeetLink, tutorSearch, createGoogleMeetAndSendEmail } = require('../middleware/helperFunctions');
// const { meet } = require("googleapis/build/src/apis/meet");

// @desc Book a free trial for the user
//@route POST /free-trial
//@access public
const bookFreeTrial = asyncHandler(async (req, res) => {
    const { mobilenumber, username, gender, agegroup, category, emailID, password, timezone, utcDateTime } = req.body;
  
    // 1️⃣ Check if all required fields are present
    if (!mobilenumber || !username || !gender || !agegroup || !category || !emailID || !password || !timezone || !utcDateTime) {
      return res.status(400).json({ message: "All fields are required" });
    }
   
    const tutor = await tutorSearch(category, utcDateTime);
    const meetDetails = await createGoogleMeetAndSendEmail(emailID,utcDateTime);
    // console.log(tutor);
    // console.log(meetDetails);
    // 2️⃣ Check if the user already exists (mobilenumber uniqueness check)
    const existingUser = await User.findOne({ mobilenumber });
    if (existingUser) {
      return res.status(400).json({ message: "Mobilenumber already registered" });
    }
  
    // 3️⃣ Hash the password before saving (bcrypt with 10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // 4️⃣ Register the user
    const newUser = await User.create({
      mobilenumber,
      username,
      gender,
      agegroup,
      category,
      emailID,
      password: hashedPassword, // Store hashed password
      timezone,
    });
    //console.log(newUser);  
    // 5️⃣ Create a future session for the user
    const newSession = await FutureSession.create({
      tutorName: tutor.username,
      tutorMobileNo: tutor.mobilenumber,
      tutorTimeZone: tutor.timezone,
      userName: username,
      userMobileNo: mobilenumber,
      userTimeZone: timezone,
      meetLink: meetDetails.meetLink,
      category: category,
      sessionType: "free-trial",
      sessionDateTime: utcDateTime,
    });
    //console.log(newSession);

  //&& newSession
    if (newUser && newSession ) {
      res.status(201).json({
        message: "User registered and session created successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          emailID: newUser.emailID,
        },
        session: {
          id: newSession._id,
          meetLink: newSession.meetLink,
          sessionDateTime: newSession.sessionDateTime,
        }
      });
    } else {
      res.status(500).json({ message: "Failed to register user or create session" });
    }
});

//@desc Login the student
//@route POST /student/login
//@access Public
const loginStudent = asyncHandler(async (req, res) => {
  const { mobilenumber, password } = req.body;

  // 1️⃣ Validate required fields
  if (!mobilenumber || !password) {
    return res.status(400).json({ message: "Both mobile number and password are required" });
  }

  // 2️⃣ Fetch student details by mobile number
  const user = await User.findOne({ mobilenumber });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 3️⃣ Validate password using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 4️⃣ Generate JWT token (valid for 7 days)
  const token = jwt.sign(
    { user: { username: user.username, mobilenumber: user.mobilenumber, id: user._id, role: "student" } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // 5️⃣ Send response with token and user details
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      mobilenumber: user.mobilenumber,
      role: "student",
      // add additional fields if needed (e.g., email, etc.)
    },
    token,
  });
});


// @desc current user
//@route GET /
// current
//@access private
const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
});

module.exports = {bookFreeTrial, loginStudent, currentUser}