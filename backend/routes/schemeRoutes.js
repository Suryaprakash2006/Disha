const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/schemeController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.listSchemes);
router.get('/compare', ctrl.compareSchemes);
router.get('/updates/all', protect, adminOnly, ctrl.getSchemeUpdateHistory);
router.get('/:id/updates', protect, adminOnly, ctrl.getSchemeUpdateHistory);
router.get('/:id', ctrl.getScheme);

router.post('/', protect, adminOnly, ctrl.createScheme);
router.put('/:id', protect, adminOnly, ctrl.updateScheme);
router.patch('/:id/status', protect, adminOnly, ctrl.setSchemeStatus);
router.patch('/:id/verify', protect, adminOnly, ctrl.verifyScheme);
router.delete('/:id', protect, adminOnly, ctrl.deleteScheme);

module.exports = router;
