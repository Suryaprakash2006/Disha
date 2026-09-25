const mongoose = require('mongoose');

const ChannelPartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['SCA', 'PSB', 'RRB', 'NBFC-MFI', 'Cooperative Bank', 'Small Finance Bank', 'Cooperative Society', 'Other Authorized Agency'],
      required: true,
    },
    state: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String },
    email: { type: String },
    website: { type: String },

    supportedSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
    supportedPartnerTypes: [{ type: String }],

    activeStatus: { type: Boolean, default: true },
    eligibilityStatus: { type: String, enum: ['eligible', 'not_eligible', 'under_review'], default: 'eligible' },

    // Explicitly prototype/demo fields — must always be labeled as such in the UI.
    fundUtilizationStatus: { type: String, default: 'Demo data — not real-time' },
    overdueStatus: { type: String, default: 'Demo data — not real-time' },
    dataLabel: { type: String, default: 'Prototype / Admin-verified dataset' },

    lastVerifiedAt: { type: Date, required: true },
    sourceUrl: { type: String },
  },
  { timestamps: true }
);

ChannelPartnerSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('ChannelPartner', ChannelPartnerSchema);
