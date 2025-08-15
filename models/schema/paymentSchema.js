const mongoose = require('mongoose');
const { generatePaymentID } = require("../../controllers/generateIDs")

const paymentSchema = new mongoose.Schema({
  paymentID: { type: String, unique: true }, // optional, can auto-generate
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

  totalCourseFee: { type: Number, required: true }, // total course fee
  isFullyPaid: { type: Boolean, default: false },

  installments: [
    {
      invoiceID: { type: String, unique: true },  // unique invoice per installment
      invoiceAmount: { type: Number, required: true },
      invoiceDate: { type: Date, default: Date.now },

      amountPaid: { type: Number }, // can be same as invoiceAmount or partial
      datePaid: { type: Date },
      screenshotLink: String,

      verifiedByAdmin: { type: Boolean, default: false },
      verificationDate: Date,
      comment: String, // optional: for admin notes
    }
  ],

  createdAt: { type: Date, default: Date.now },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // optional
});


//generate id auto
paymentSchema.pre('save', async function (next) {
    if (!this.paymentID) {
      this.paymentID = await generatePaymentID();
    }
    next();
  });

  
module.exports = mongoose.model('Payment', paymentSchema);
