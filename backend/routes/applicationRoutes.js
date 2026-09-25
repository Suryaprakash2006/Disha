const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, ctrl.listMyApplications);
router.post('/', protect, ctrl.createApplication);
router.put('/:id', protect, ctrl.updateApplication);
router.delete('/:id', protect, ctrl.deleteApplication);

router.get('/admin/all', protect, adminOnly, ctrl.listAllApplications);

module.exports = router;
