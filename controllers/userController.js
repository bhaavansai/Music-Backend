const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const FutureSession = require("../models/sessionModel");
const { createGoogleMeetLink, tutorSearch, createGoogleMeetAndSendEmail } = require('../middleware/helperFunctions');
const Session = require('../models/schema/sessionSchema')
const Payment = require("../models/schema/paymentSchema")

const Student = require("../models/schema/studentSchema")
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

//#############################################################################################333333
//to set the events in calender 
const getStudentCalendarEvents = async (req, res) => {
  const { studentId } = req.params;

  try {
    const sessions = await Session.find({
      students: studentId,
      date: { $gte: new Date() },
    }).populate('course tutor');

    const payments = await Payment.find({
      student: studentId,
      'installments.invoiceDate': { $gte: new Date() }
    });

    const events = [];

    // Sessions
    sessions.forEach(session => {
      events.push({
        title: `${session.course?.name || 'Session'} with ${session.tutor?.name || ''}`,
        type: 'session',
        date: session.date,
        sessionId: session._id,
      });
    });

    // Installment Invoices
    payments.forEach(payment => {
      payment.installments.forEach(installment => {
        if (installment.invoiceDate >= new Date()) {
          events.push({
            title: `Payment Due - ₹${installment.invoiceAmount}`,
            type: 'payment',
            date: installment.invoiceDate,
            paymentId: payment._id,
          });
        }
      });
    });

    res.status(200).json(events);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching student calendar events' });
  }
};





// const registerDummyStudent = async () => {
//   try {
   
//     const student = new Student({
//       name: 'testing2',
//       email: 'lalankr302@gmail.com',
//       password: "123456",
//       phone: '+918521754454',
//       category: ['Flute', 'Piyano'],
//       timeZone: 'America/New_York',
//       clientDetails: {
//         country: 'america',
//         city: 'new york',
//         parentName: 'Manoj saw',
//         gender: 'Male',
//         ageGroup: '1-6',
//       },
//       enrolledCourses: [],  // You can add course ObjectIds here
//       sessions: [],         // You can add session ObjectIds here
//       paymentHistory: [],   // Add payment ObjectIds if needed
//     });

//     await student.save();
//     console.log('🎉 Dummy student registered successfully:', student);
//   } catch (err) {
//     console.error('❌ Error registering dummy student:', err.message);
//   }
// }; 
module.exports = {
  bookFreeTrial,
   loginStudent,
    currentUser,
     getStudentCalendarEvents
    }