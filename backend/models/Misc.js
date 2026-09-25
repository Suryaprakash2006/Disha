const mongoose = require('mongoose');

const SchemeUpdateSchema = new mongoose.Schema(
  {
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    changeType: { type: String, enum: ['create', 'update', 'activate', 'deactivate', 'verify'], required: true },
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    sourceUrl: { type: String },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SavedSchemeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
  },
  { timestamps: true }
);
SavedSchemeSchema.index({ userId: 1, schemeId: 1 }, { unique: true });

module.exports = {
  SchemeUpdate: mongoose.model('SchemeUpdate', SchemeUpdateSchema),
  SavedScheme: mongoose.model('SavedScheme', SavedSchemeSchema),
};
