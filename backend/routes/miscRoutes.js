const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/miscController');
const { protect, adminOnly } = require('../middleware/auth');

// Saved schemes
router.get('/saved-schemes', protect, ctrl.listSavedSchemes);
router.post('/saved-schemes', protect, ctrl.saveScheme);
router.delete('/saved-schemes/:schemeId', protect, ctrl.unsaveScheme);

// Calculator
router.post('/calculator/emi', ctrl.calculateEmi);

// AI assistant (grounded, non-authoritative)
router.get('/ai/scheme/:schemeId', ctrl.aiExplainScheme);
router.post('/ai/match', ctrl.aiExplainMatch);
router.get('/ai/documents/:schemeId', ctrl.aiExplainDocuments);
router.get('/ai/term', ctrl.aiExplainTerm);

// Admin dashboard
router.get('/admin/summary', protect, adminOnly, ctrl.adminDashboardSummary);
router.get('/admin/user-matches', protect, adminOnly, ctrl.adminListUserMatches);

module.exports = router;
