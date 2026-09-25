const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },

    age: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    category: { type: String, enum: ['General', 'SC', 'ST', 'OBC', 'EWS', 'Other'] },
    state: { type: String },
    district: { type: String },
    residenceType: { type: String, enum: ['Rural', 'Urban'] },
    annualIncome: { type: Number },
    educationStatus: { type: String },
    employmentStatus: { type: String },

    // Business / loan requirement profile (used by matching engine)
    businessType: { type: String },
    businessActivity: { type: String },
    businessCategory: { type: String, enum: ['Manufacturing', 'Service', 'Trading', 'Other'] },
    newOrExistingBusiness: { type: String, enum: ['New', 'Existing'] },
    projectCost: { type: Number },
    loanRequired: { type: Number },
    previousLoanHistory: { type: String, enum: ['None', 'Repaid', 'Ongoing', 'Defaulted'] },

    profileCompletion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
