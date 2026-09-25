const { matchUserToSchemes } = require('../utils/matchingEngine');
const User = require('../models/User');

function buildInputFromUser(user, overrides = {}) {
  return {
    category: overrides.category ?? user.category,
    age: overrides.age ?? user.age,
    annualIncome: overrides.annualIncome ?? user.annualIncome,
    state: overrides.state ?? user.state,
    district: overrides.district ?? user.district,
    residenceType: overrides.residenceType ?? user.residenceType,
    educationStatus: overrides.educationStatus ?? user.educationStatus,
    businessType: overrides.businessType ?? user.businessType,
    businessActivity: overrides.businessActivity ?? user.businessActivity,
    businessCategory: overrides.businessCategory ?? user.businessCategory,
    newOrExistingBusiness: overrides.newOrExistingBusiness ?? user.newOrExistingBusiness,
    projectCost: overrides.projectCost ?? user.projectCost,
    loanRequired: overrides.loanRequired ?? user.loanRequired,
    previousLoanHistory: overrides.previousLoanHistory ?? user.previousLoanHistory,
  };
}

// POST /api/match  — uses the logged-in user's saved profile, optionally overridden by body
exports.runMatch = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const input = buildInputFromUser(user, req.body || {});
    const results = await matchUserToSchemes(input);
    res.json({ success: true, input, results, disclaimer: 'Prototype preliminary matching only. Not an official eligibility decision.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/match/preview — stateless, doesn't require a saved profile (used e.g. mid-onboarding)
exports.previewMatch = async (req, res, next) => {
  try {
    const input = req.body || {};
    const results = await matchUserToSchemes(input);
    res.json({ success: true, input, results, disclaimer: 'Prototype preliminary matching only. Not an official eligibility decision.' });
  } catch (err) {
    next(err);
  }
};
