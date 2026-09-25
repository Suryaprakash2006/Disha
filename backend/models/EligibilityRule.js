const mongoose = require('mongoose');

const EligibilityRuleSchema = new mongoose.Schema(
  {
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
    field: { type: String, required: true }, // maps to matching engine input keys, e.g. "annualIncome"
    operator: {
      type: String,
      enum: ['==', '!=', '>', '>=', '<', '<=', 'IN', 'NOT_IN', 'BETWEEN'],
      required: true,
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true }, // scalar, array, or [min,max] for BETWEEN
    ruleType: { type: String, enum: ['mandatory', 'conditional', 'informational'], required: true },
    priority: { type: Number, default: 1 },
    explanation: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EligibilityRule', EligibilityRuleSchema);
