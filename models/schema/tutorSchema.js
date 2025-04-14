const mongoose = require('mongoose');
const {generateTutorID} = require("../../controllers/generateIDs")
const tutorSchema = new mongoose.Schema({
    tutorID: { type: String, unique: true },
    name: String,
    email: String,
    phone: String,
    skills: [String], // e.g., "Guitar", "Piano"
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    rating: Number,
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  });
  
// Auto-generate studentID like STU0001, STU0002...
tutorSchema.pre('save', async function (next) {
    if (!this.tutorID) {
      this.tutorID = await generateTutorID();
    }
    next(); 
  });

  module.exports = mongoose.model('Tutor', tutorSchema);