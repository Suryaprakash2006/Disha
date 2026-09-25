const User = require('../models/User');

const PROFILE_FIELDS = [
  'name', 'phone', 'age', 'gender', 'category', 'state', 'district', 'residenceType',
  'annualIncome', 'educationStatus', 'employmentStatus',
  'businessType', 'businessActivity', 'businessCategory', 'newOrExistingBusiness',
  'projectCost', 'loanRequired', 'previousLoanHistory',
];

function computeCompletion(user) {
  const filled = PROFILE_FIELDS.filter((f) => user[f] !== undefined && user[f] !== null && user[f] !== '').length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
}

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    PROFILE_FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    const user = await User.findById(req.user._id);
    Object.assign(user, updates);
    user.profileCompletion = computeCompletion(user);
    await user.save();
    const u = user.toObject();
    delete u.password;
    res.json({ success: true, user: u });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const u = user.toObject();
    delete u.password;
    res.json({ success: true, user: u });
  } catch (err) {
    next(err);
  }
};
