const Application = require('../models/Application');

exports.listMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('schemeId', 'name shortName organization')
      .populate('channelPartnerId', 'name type')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};

exports.createApplication = async (req, res, next) => {
  try {
    const { schemeId, channelPartnerId, applicationReference, status, submittedDate, notes } = req.body;
    const application = await Application.create({
      userId: req.user._id,
      schemeId,
      channelPartnerId,
      applicationReference,
      status: status || 'Draft',
      submittedDate,
      notes,
      lastUpdated: new Date(),
    });
    res.status(201).json({ success: true, application, note: 'Simulated tracking — not connected to an official government API.' });
  } catch (err) {
    next(err);
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, userId: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    Object.assign(application, req.body, { lastUpdated: new Date() });
    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    next(err);
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application removed' });
  } catch (err) {
    next(err);
  }
};

// ---- Admin ----
exports.listAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email')
      .populate('schemeId', 'name shortName')
      .populate('channelPartnerId', 'name type')
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (err) {
    next(err);
  }
};
