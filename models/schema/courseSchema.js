const mongoose = require('mongoose');
const {generateCourseIDs} = require("../../controllers/generateIDs")
const courseSchema = new mongoose.Schema({
    courseID: { type: String, unique: true },
    name: String, // e.g., "Beginner Guitar"
    description: String,
    duration: String, // e.g., "3 Months"
    category: {
        type: String, // Can store multiple values
        required: [true, "Please specify one category"],
      },
    price: Number,

    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
  });
  
// Auto-generate courseID like STU0001, STU0002...
courseSchema.pre('save', async function (next) {
    if (!this.courseID) {
      this.courseID = await generateCourseIDs();
    }
    next(); 
  });
  module.exports = mongoose.model('Course', courseSchema);