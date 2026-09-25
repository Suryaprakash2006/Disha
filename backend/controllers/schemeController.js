const Scheme = require('../models/Scheme');
const EligibilityRule = require('../models/EligibilityRule');
const { SchemeUpdate } = require('../models/Misc');

exports.listSchemes = async (req, res, next) => {
  try {
    const { status = 'active', schemeType } = req.query;
    const filter = {};
    if (status !== 'all') filter.status = status;
    if (schemeType) filter.schemeType = schemeType;
    const schemes = await Scheme.find(filter).sort({ organization: 1, name: 1 });
    res.json({ success: true, count: schemes.length, schemes });
  } catch (err) {
    next(err);
  }
};

exports.getScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    res.json({ success: true, scheme });
  } catch (err) {
    next(err);
  }
};

exports.compareSchemes = async (req, res, next) => {
  try {
    const ids = (req.query.ids || '').split(',').filter(Boolean);
    if (!ids.length) return res.status(400).json({ success: false, message: 'Provide scheme ids as ?ids=a,b,c' });
    const schemes = await Scheme.find({ _id: { $in: ids } });
    res.json({ success: true, schemes, note: 'Factual comparison only — Disha does not declare a "best" scheme.' });
  } catch (err) {
    next(err);
  }
};

// ---- Admin CRUD ----

exports.createScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.create(req.body);
    await SchemeUpdate.create({
      schemeId: scheme._id,
      changedBy: req.user._id,
      changeType: 'create',
      newValue: scheme.toObject(),
      sourceUrl: scheme.officialSourceUrl,
      reason: 'Initial creation',
    });
    res.status(201).json({ success: true, scheme });
  } catch (err) {
    next(err);
  }
};

exports.updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    const oldValue = scheme.toObject();
    Object.assign(scheme, req.body);
    scheme.version = (scheme.version || 1) + 1;
    await scheme.save();
    await SchemeUpdate.create({
      schemeId: scheme._id,
      changedBy: req.user._id,
      changeType: 'update',
      oldValue,
      newValue: scheme.toObject(),
      sourceUrl: req.body.officialSourceUrl || scheme.officialSourceUrl,
      reason: req.body.reason || 'Scheme updated',
    });
    res.json({ success: true, scheme });
  } catch (err) {
    next(err);
  }
};

exports.setSchemeStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // active | inactive
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    const oldValue = { status: scheme.status };
    scheme.status = status;
    await scheme.save();
    await SchemeUpdate.create({
      schemeId: scheme._id,
      changedBy: req.user._id,
      changeType: status === 'active' ? 'activate' : 'deactivate',
      oldValue,
      newValue: { status },
      reason: `Status changed to ${status}`,
    });
    res.json({ success: true, scheme });
  } catch (err) {
    next(err);
  }
};

exports.verifyScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    const oldValue = { lastVerifiedAt: scheme.lastVerifiedAt };
    scheme.lastVerifiedAt = new Date();
    await scheme.save();
    await SchemeUpdate.create({
      schemeId: scheme._id,
      changedBy: req.user._id,
      changeType: 'verify',
      oldValue,
      newValue: { lastVerifiedAt: scheme.lastVerifiedAt },
      sourceUrl: scheme.officialSourceUrl,
      reason: req.body.reason || 'Re-verified against official source',
    });
    res.json({ success: true, scheme });
  } catch (err) {
    next(err);
  }
};

exports.deleteScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });
    await EligibilityRule.deleteMany({ schemeId: scheme._id });
    await scheme.deleteOne();
    res.json({ success: true, message: 'Scheme and associated rules deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getSchemeUpdateHistory = async (req, res, next) => {
  try {
    const filter = req.params.id ? { schemeId: req.params.id } : {};
    const updates = await SchemeUpdate.find(filter).populate('changedBy', 'name email').populate('schemeId', 'name').sort({ timestamp: -1 });
    res.json({ success: true, updates });
  } catch (err) {
    next(err);
  }
};
