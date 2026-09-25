const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/documentController');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/types', ctrl.listDocumentTypes);
router.get('/checklist/:schemeId', protect, ctrl.getChecklist);
router.patch('/checklist/:schemeId', protect, ctrl.markDocumentStatus);
router.post('/upload/:schemeId', protect, upload.single('file'), ctrl.uploadDocument);

router.post('/types', protect, adminOnly, ctrl.createDocumentType);
router.put('/types/:id', protect, adminOnly, ctrl.updateDocumentType);
router.delete('/types/:id', protect, adminOnly, ctrl.deleteDocumentType);

module.exports = router;
