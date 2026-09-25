const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eligibilityRuleController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/scheme/:schemeId', protect, adminOnly, ctrl.listRulesForScheme);
router.post('/', protect, adminOnly, ctrl.createRule);
router.put('/:id', protect, adminOnly, ctrl.updateRule);
router.delete('/:id', protect, adminOnly, ctrl.deleteRule);

module.exports = router;
