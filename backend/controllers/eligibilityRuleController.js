const EligibilityRule = require('../models/EligibilityRule');

exports.listRulesForScheme = async (req, res, next) => {
  try {
    const rules = await EligibilityRule.find({ schemeId: req.params.schemeId }).sort({ priority: -1 });
    res.json({ success: true, rules });
  } catch (err) {
    next(err);
  }
};

exports.createRule = async (req, res, next) => {
  try {
    const rule = await EligibilityRule.create(req.body);
    res.status(201).json({ success: true, rule });
  } catch (err) {
    next(err);
  }
};

exports.updateRule = async (req, res, next) => {
  try {
    const rule = await EligibilityRule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
    res.json({ success: true, rule });
  } catch (err) {
    next(err);
  }
};

exports.deleteRule = async (req, res, next) => {
  try {
    const rule = await EligibilityRule.findByIdAndDelete(req.params.id);
    if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
    res.json({ success: true, message: 'Rule deleted' });
  } catch (err) {
    next(err);
  }
};
