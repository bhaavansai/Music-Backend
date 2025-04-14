// utils/generateIDs.js
const Counter = require('../models/schema/counter');

const getNextID = async (name, prefix) => {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const number = counter.seq.toString().padStart(4, '0');
  return `${prefix}${number}`;
};

// 5 specific ID generators
const generateStudentID = () => getNextID('Student', 'STU');
const generateTutorID = () => getNextID('Tutor', 'TUT');
const generateCourseID = () => getNextID('Course', 'CRS');
const generatePaymentID = () => getNextID('Payment', 'PAY');
const generateSessionID = () => getNextID('Session', 'SES');

module.exports = {
  generateStudentID,
  generateTutorID,
  generateCourseID,
  generatePaymentID,
  generateSessionID,
};
