const express = require('express');
const router = express.Router();
const { runMatch, previewMatch } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.post('/', protect, runMatch);
router.post('/preview', previewMatch);

module.exports = router;
