const { DocumentType, UserDocument } = require('../models/DocumentRecord');
const Scheme = require('../models/Scheme');

exports.listDocumentTypes = async (req, res, next) => {
  try {
    const types = await DocumentType.find({ active: true }).sort({ category: 1, name: 1 });
    res.json({ success: true, types });
  } catch (err) {
    next(err);
  }
};

// GET /api/documents/checklist/:schemeId — readiness for the logged-in user against a scheme's required docs
exports.getChecklist = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.schemeId);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });

    const existing = await UserDocument.find({ userId: req.user._id, schemeId: scheme._id });
    const existingMap = new Map(existing.map((d) => [d.documentName, d]));

    const checklist = (scheme.requiredDocuments || []).map((docName) => {
      const rec = existingMap.get(docName);
      return {
        documentName: docName,
        status: rec ? rec.status : 'pending',
        uploadedAt: rec ? rec.uploadedAt : null,
        _id: rec ? rec._id : null,
      };
    });

    const readyCount = checklist.filter((c) => c.status !== 'pending').length;
    const readinessPercentage = checklist.length ? Math.round((readyCount / checklist.length) * 100) : 0;

    res.json({
      success: true,
      schemeId: scheme._id,
      checklist,
      readinessPercentage,
      label: 'Document Readiness', // never "Government Verification"
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/documents/checklist/:schemeId  { documentName, status }
exports.markDocumentStatus = async (req, res, next) => {
  try {
    const { documentName, status } = req.body;
    if (!documentName || !['pending', 'ready', 'uploaded'].includes(status)) {
      return res.status(400).json({ success: false, message: 'documentName and a valid status are required' });
    }
    const doc = await UserDocument.findOneAndUpdate(
      { userId: req.user._id, schemeId: req.params.schemeId, documentName },
      { status, uploadedAt: status === 'uploaded' ? new Date() : undefined },
      { new: true, upsert: true }
    );
    res.json({ success: true, document: doc, note: 'Document Readiness reflects self-reported status, not government verification.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/documents/upload/:schemeId  (multipart) — prototype upload only
exports.uploadDocument = async (req, res, next) => {
  try {
    const { documentName } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    if (!documentName) return res.status(400).json({ success: false, message: 'documentName is required' });

    const doc = await UserDocument.findOneAndUpdate(
      { userId: req.user._id, schemeId: req.params.schemeId, documentName },
      { status: 'uploaded', filePath: req.file.path, uploadedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, document: doc, note: 'Prototype upload only — not officially verified by any government authority.' });
  } catch (err) {
    next(err);
  }
};

// ---- Admin CRUD for document types ----
exports.createDocumentType = async (req, res, next) => {
  try {
    const type = await DocumentType.create(req.body);
    res.status(201).json({ success: true, type });
  } catch (err) {
    next(err);
  }
};

exports.updateDocumentType = async (req, res, next) => {
  try {
    const type = await DocumentType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!type) return res.status(404).json({ success: false, message: 'Document type not found' });
    res.json({ success: true, type });
  } catch (err) {
    next(err);
  }
};

exports.deleteDocumentType = async (req, res, next) => {
  try {
    const type = await DocumentType.findByIdAndDelete(req.params.id);
    if (!type) return res.status(404).json({ success: false, message: 'Document type not found' });
    res.json({ success: true, message: 'Document type deleted' });
  } catch (err) {
    next(err);
  }
};
