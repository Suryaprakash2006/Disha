const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/channelPartnerController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.listPartners);
router.post('/nearby', ctrl.findNearbyPartners);
router.get('/:id', ctrl.getPartner);

router.post('/', protect, adminOnly, ctrl.createPartner);
router.put('/:id', protect, adminOnly, ctrl.updatePartner);
router.delete('/:id', protect, adminOnly, ctrl.deletePartner);

module.exports = router;
