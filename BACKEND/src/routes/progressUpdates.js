const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { submitUpdate, listPending, reviewUpdate } = require('../controllers/progressController');

// Contractor submits a progress update
router.post('/', requireAuth, requireRole('CONTRACTOR'), submitUpdate);

// Govt employee views all pending updates
router.get('/pending', requireAuth, requireRole('GOVT_EMPLOYEE', 'ADMIN'), listPending);

// Govt employee approves/rejects a specific update
router.patch('/:id/review', requireAuth, requireRole('GOVT_EMPLOYEE', 'ADMIN'), reviewUpdate);

module.exports = router;