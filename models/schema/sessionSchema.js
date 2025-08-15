const mongoose = require('mongoose');
const { generateSessionID } = require('../../controllers/generateIDs');

const sessionSchema = new mongoose.Schema({
  sessionID: { type: String, unique: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course',  default: null },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', default: null },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  date: { type: Date }, // includes both date and time
  duration: { type: Number }, // in minutes or seconds, up to you
  maxStudents: { type: Number }, // optional
  category: {
    type: String, // Can store multiple values
    required: [true, "Please specify one category"],
  },
  type: {
    type: String,
    enum: ['Free Trial', 'Regular', 'Makeup', 'Workshop'],
    default: 'Regular',
  },

  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  feedback: String,
});

//generate auto sessionid 
sessionSchema.pre('save', async function (next) {
    if (!this.sessionID) {
      this.sessionID = await generateSessionID();
    }
    next();
  });

module.exports = mongoose.model('Session', sessionSchema);
