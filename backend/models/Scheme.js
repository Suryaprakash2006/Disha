const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortName: { type: String },
    organization: { type: String, required: true }, // e.g. NSFDC, MUDRA, SUPI
    department: { type: String, required: true },
    schemeType: { type: String, enum: ['NSFDC', 'Other Government Scheme'], required: true },
    description: { type: String },
    purpose: { type: String },

    beneficiaryCategories: [{ type: String }], // SC, ST, OBC, EWS, Women, etc.
    businessTypes: [{ type: String }],
    eligibleActivities: [{ type: String }],

    minAge: { type: Number },
    maxAge: { type: Number },
    minIncome: { type: Number },
    maxIncome: { type: Number },

    minProjectCost: { type: Number },
    maxProjectCost: { type: Number },

    minLoanAmount: { type: Number },
    maxLoanAmount: { type: Number },

    interestRate: { type: String }, // stored as descriptive text/range, e.g. "6% p.a. (concessional)"
    repaymentPeriod: { type: String }, // e.g. "Up to 10 years"
    moratorium: { type: String },

    subsidy: { type: String },
    benefits: [{ type: String }],

    locationRules: { type: String }, // e.g. "All India", "Rural preferred"

    requiredDocuments: [{ type: String }],

    channelPartnerTypes: [{ type: String }], // SCA, PSB, RRB, NBFC-MFI, etc.

    applicationMethod: { type: String },
    applicationInstructions: { type: String },
    officialApplicationUrl: { type: String },
    officialSourceUrl: { type: String, required: true },

    sourceName: { type: String, required: true },
    lastVerifiedAt: { type: Date, required: true },
    version: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scheme', SchemeSchema);
