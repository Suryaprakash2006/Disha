const mongoose = require('mongoose');

// Master list of document types (admin-managed) — distinct from user uploads below.
const DocumentTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. "Aadhaar/Identity Proof"
    description: { type: String },
    category: { type: String, enum: ['Identity', 'Income', 'Address', 'Business', 'Financial', 'Other'], default: 'Other' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Per-user document readiness / prototype upload tracking.
const UserDocumentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },
    documentName: { type: String, required: true },
    status: { type: String, enum: ['pending', 'ready', 'uploaded'], default: 'pending' },
    filePath: { type: String }, // prototype upload only, not officially verified
    uploadedAt: { type: Date },
  },
  { timestamps: true }
);

const DocumentType = mongoose.model('DocumentType', DocumentTypeSchema);
const UserDocument = mongoose.model('UserDocument', UserDocumentSchema);

module.exports = { DocumentType, UserDocument };
