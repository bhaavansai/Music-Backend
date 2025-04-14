const mongoose = require('mongoose');
const {generateStudentID} = require("../../controllers/generateIDs")
const studentSchema = new mongoose.Schema({
  studentID: { type: String, unique: true, index: true },
  name: { type: String,   required: [true, "Please add the user name"] },
  email: {
    type: String,
    required: [true, "Please add an email ID"],
    unique: [true, "Email ID already taken"],
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  phone: { 
    type: String,
    required: [true, "Please add mobile number"],
    unique: [true, "Mobile number already taken"],
   },
   category: {
    type: [String], // Can store multiple values
    required: [true, "Please specify at least one category"],
  },
  timeZone: String,
  status: {
    type: String,
    enum: ['Free Trial', 'Under Progress', 'Course Registered'],
    default: 'Free Trial'
  },
  clientDetails: {
    country: String,
    city: String,
    parentName: String,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    ageGroup: String,
  },

  enrolledCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      enrolledAt: { type: Date, default: Date.now },
      isActive: { type: Boolean, default: true },
    }
  ],

  sessions: [
    {
      session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
      joinedAt: { type: Date, default: Date.now },
      feedbackGiven: { type: Boolean, default: false },
    }
  ],

  paymentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  registeredAt: { type: Date, default: Date.now },
});

// Compound index for faster search across key fields
studentSchema.index({ studentID: 1, name: 1, phone: 1, category: 1 ,status:1, registeredAt:-1});
 
// Auto-generate studentID like STU0001, STU0002...
studentSchema.pre('save', async function (next) {
    if (!this.studentID) {
      this.studentID = await generateStudentID();
    }
    next();
  });
module.exports = mongoose.model('Student', studentSchema);
