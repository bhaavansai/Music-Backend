const mongoose = require('mongoose');

const futureSessionSchema = new mongoose.Schema({
  tutorName: { type: String, required: true },
  tutorMobileNo: { type: String, required: true },
  tutorTimeZone: { type: String, required: true },
  userName: { type: String, required: true },
  userMobileNo: { type: String, required: true },
  userTimeZone: { type: String, required: true },
  meetLink: { type: String, required: true },
  category: { type: String, required: true },
  sessionType: { type: String, required: true },
  sessionDateTime: {
     
    type: String, 
    required: true // This stores both date and time in UTC (ISO 8601 format)
  }
});

module.exports = mongoose.model('FutureSession', futureSessionSchema);
