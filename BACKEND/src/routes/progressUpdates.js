const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { submitUpdate, listPending, reviewUpdate, uploadProof } = require('../controllers/progressController');

// Contractor uploads a proof photo (before submitting the update itself)
router.post('/upload-proof', requireAuth, requireRole('CONTRACTOR'), upload.single('photo'), uploadProof);

// Contractor submits a progress update
router.post('/', requireAuth, requireRole('CONTRACTOR'), submitUpdate);

// Govt employee views all pending updates
router.get('/pending', requireAuth, requireRole('GOVT_EMPLOYEE', 'ADMIN'), listPending);

// Govt employee approves/rejects a specific update
router.patch('/:id/review', requireAuth, requireRole('GOVT_EMPLOYEE', 'ADMIN'), reviewUpdate);

module.exports = router;