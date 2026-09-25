const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
    channelPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChannelPartner' },
    applicationReference: { type: String },
    status: {
      type: String,
      enum: [
        'Draft',
        'Documents Pending',
        'Application Submitted',
        'Under Review',
        'Additional Information Required',
        'Approved',
        'Rejected',
      ],
      default: 'Draft',
    },
    submittedDate: { type: Date },
    lastUpdated: { type: Date, default: Date.now },
    isSimulated: { type: Boolean, default: true }, // always true unless a real gov API is connected
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', ApplicationSchema);
