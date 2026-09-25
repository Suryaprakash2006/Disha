const { SavedScheme } = require('../models/Misc');
const Scheme = require('../models/Scheme');
const User = require('../models/User');
const ChannelPartner = require('../models/ChannelPartner');
const Application = require('../models/Application');
const ai = require('../utils/aiAssistant');
const { matchUserToSchemes } = require('../utils/matchingEngine');

// ---- Saved Schemes ----
exports.saveScheme = async (req, res, next) => {
  try {
    const { schemeId } = req.body;
    const saved = await SavedScheme.findOneAndUpdate(
      { userId: req.user._id, schemeId },
      { userId: req.user._id, schemeId },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, saved });
  } catch (err) {
    next(err);
  }
};

exports.unsaveScheme = async (req, res, next) => {
  try {
    await SavedScheme.findOneAndDelete({ userId: req.user._id, schemeId: req.params.schemeId });
    res.json({ success: true, message: 'Removed from saved schemes' });
  } catch (err) {
    next(err);
  }
};

exports.listSavedSchemes = async (req, res, next) => {
  try {
    const saved = await SavedScheme.find({ userId: req.user._id }).populate('schemeId');
    res.json({ success: true, saved });
  } catch (err) {
    next(err);
  }
};

// ---- Financial Calculator ----
// POST /api/calculator/emi { loanAmount, annualInterestRate, tenureMonths, schemeId? }
exports.calculateEmi = async (req, res, next) => {
  try {
    const { loanAmount, annualInterestRate, tenureMonths, schemeId } = req.body;
    const P = Number(loanAmount);
    const annualRate = Number(annualInterestRate);
    const n = Number(tenureMonths);

    if (!P || !annualRate || !n) {
      return res.status(400).json({ success: false, message: 'loanAmount, annualInterestRate and tenureMonths are required' });
    }

    const r = annualRate / 12 / 100;
    let monthlyEMI;
    if (r === 0) {
      monthlyEMI = P / n;
    } else {
      monthlyEMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    const totalRepayment = monthlyEMI * n;
    const totalInterest = totalRepayment - P;

    let schemeContext = null;
    if (schemeId) {
      const scheme = await Scheme.findById(schemeId).select('name maxLoanAmount interestRate repaymentPeriod moratorium');
      if (scheme) {
        schemeContext = {
          name: scheme.name,
          schemeMaxLoan: scheme.maxLoanAmount,
          schemeInterestInfo: scheme.interestRate,
          maxRepaymentPeriod: scheme.repaymentPeriod,
          moratorium: scheme.moratorium,
        };
      }
    }

    res.json({
      success: true,
      inputs: { principal: P, annualInterestRate: annualRate, tenureMonths: n },
      results: {
        principal: Math.round(P),
        estimatedEMI: Math.round(monthlyEMI),
        totalInterest: Math.round(totalInterest),
        totalRepayment: Math.round(totalRepayment),
      },
      schemeContext,
      disclaimer: 'This is an estimate for planning purposes only, not a loan offer or official calculation.',
    });
  } catch (err) {
    next(err);
  }
};

// ---- AI Assistant (grounded, non-authoritative on eligibility) ----
exports.aiExplainScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.schemeId);
    if (!scheme) return res.json({ success: true, answer: "I don't have information about that scheme in the database." });
    res.json({ success: true, answer: ai.explainScheme(scheme) });
  } catch (err) {
    next(err);
  }
};

exports.aiExplainMatch = async (req, res, next) => {
  try {
    const { schemeId, matchInput } = req.body;
    const results = await matchUserToSchemes(matchInput || {});
    const matchResult = results.find((r) => String(r.scheme._id) === String(schemeId));
    res.json({ success: true, answer: ai.explainMatch(matchResult) });
  } catch (err) {
    next(err);
  }
};

exports.aiExplainDocuments = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.schemeId);
    res.json({ success: true, answer: ai.explainDocuments(scheme) });
  } catch (err) {
    next(err);
  }
};

exports.aiExplainTerm = async (req, res, next) => {
  try {
    const { term } = req.query;
    res.json({ success: true, answer: ai.explainFinancialTerm(term) });
  } catch (err) {
    next(err);
  }
};

// ---- Admin Dashboard summary ----
exports.adminDashboardSummary = async (req, res, next) => {
  try {
    const [totalSchemes, activeSchemes, totalPartners, totalUsers, totalApplications, mostRecentScheme] = await Promise.all([
      Scheme.countDocuments(),
      Scheme.countDocuments({ status: 'active' }),
      ChannelPartner.countDocuments(),
      User.countDocuments({ role: 'USER' }),
      Application.countDocuments(),
      Scheme.findOne().sort({ updatedAt: -1 }).select('name updatedAt'),
    ]);
    res.json({
      success: true,
      summary: {
        totalSchemes,
        activeSchemes,
        lastUpdated: mostRecentScheme ? mostRecentScheme.updatedAt : null,
        channelPartners: totalPartners,
        users: totalUsers,
        applications: totalApplications,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.adminListUserMatches = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'USER' }).select('-password').limit(200);
    const summaries = [];
    for (const u of users) {
      const input = {
        category: u.category, age: u.age, annualIncome: u.annualIncome, state: u.state, district: u.district,
        residenceType: u.residenceType, educationStatus: u.educationStatus, businessType: u.businessType,
        businessActivity: u.businessActivity, businessCategory: u.businessCategory,
        newOrExistingBusiness: u.newOrExistingBusiness, projectCost: u.projectCost, loanRequired: u.loanRequired,
        previousLoanHistory: u.previousLoanHistory,
      };
      const results = await matchUserToSchemes(input);
      const potential = results.filter((r) => r.status === 'POTENTIALLY_ELIGIBLE').length;
      summaries.push({ userId: u._id, name: u.name, email: u.email, potentiallyEligibleCount: potential });
    }
    res.json({ success: true, summaries });
  } catch (err) {
    next(err);
  }
};
