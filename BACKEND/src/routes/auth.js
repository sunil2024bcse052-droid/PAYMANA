const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  register,
  login,
  createStaffUser,
  listPendingUsers,
  reviewPendingUser,
  listContractors,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// Admin-only: direct staff account creation
router.post('/staff', requireAuth, requireRole('ADMIN'), createStaffUser);

// Admin-only: approval queue for self-registered GOVT_EMPLOYEE/CONTRACTOR requests
router.get('/pending', requireAuth, requireRole('ADMIN'), listPendingUsers);
router.patch('/pending/:id/review', requireAuth, requireRole('ADMIN'), reviewPendingUser);

// Employee/Admin: list registered contractors, for assigning to a project
router.get('/contractors', requireAuth, requireRole('GOVT_EMPLOYEE', 'ADMIN'), listContractors);

module.exports = router;