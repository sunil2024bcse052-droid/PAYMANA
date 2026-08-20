const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const { register, login, createStaffUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// Only an existing ADMIN can create GOVT_EMPLOYEE / CONTRACTOR / ADMIN accounts
router.post('/staff', requireAuth, requireRole('ADMIN'), createStaffUser);

module.exports = router;