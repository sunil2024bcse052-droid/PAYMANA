const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  listProjects, getProject, createProject, updateProject, deleteProject, getStats,
} = require('../controllers/projectController');

// ----- Public routes (no auth) -----
router.get('/', listProjects);
router.get('/stats/summary', getStats);
router.get('/:id', getProject);

// ----- Protected routes -----
router.post('/', requireAuth, requireRole('GOVT_EMPLOYEE', 'ADMIN'), createProject);
router.patch('/:id', requireAuth, requireRole('GOVT_EMPLOYEE', 'ADMIN'), updateProject);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteProject);

module.exports = router;