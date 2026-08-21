const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

// POST /api/auth/register - PUBLIC self-registration.
// Anyone can register as VIEWER instantly (no approval needed - browsing
// is open to everyone). If they request GOVT_EMPLOYEE or CONTRACTOR, the
// account is created but marked PENDING and cannot log in until an ADMIN
// approves it via /api/auth/pending.
async function register(req, res, next) {
  try {
    const { email, password, name, requestedRole } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password and name are required' });
    }

    const elevatedRoles = ['GOVT_EMPLOYEE', 'CONTRACTOR'];
    const wantsElevatedRole = elevatedRoles.includes(requestedRole);

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        role: 'VIEWER', // always starts as VIEWER - only upgraded on approval
        requestedRole: wantsElevatedRole ? requestedRole : null,
        status: wantsElevatedRole ? 'PENDING' : 'ACTIVE',
      },
      select: { id: true, email: true, name: true, role: true, status: true, requestedRole: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status === 'PENDING') {
      return res.status(403).json({
        error: `Your account is awaiting admin approval for the ${user.requestedRole} role. You can log in once approved.`,
      });
    }
    if (user.status === 'REJECTED') {
      return res.status(403).json({ error: 'Your account request was not approved.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/staff - ADMIN ONLY. Creates a GOVT_EMPLOYEE, CONTRACTOR,
// or ADMIN account directly, already ACTIVE. This is a shortcut for an
// admin who wants to provision an account without waiting for a self-
// registration request.
async function createStaffUser(req, res, next) {
  try {
    const { email, password, name, role } = req.body;

    const allowedStaffRoles = ['ADMIN', 'GOVT_EMPLOYEE', 'CONTRACTOR'];
    if (!email || !password || !name || !allowedStaffRoles.includes(role)) {
      return res.status(400).json({
        error: 'email, password, name and a valid role (ADMIN, GOVT_EMPLOYEE, CONTRACTOR) are required',
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, name, role, status: 'ACTIVE' },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/pending - ADMIN only. Lists all self-registered accounts
// awaiting approval for an elevated role (GOVT_EMPLOYEE or CONTRACTOR).
async function listPendingUsers(req, res, next) {
  try {
    const pending = await prisma.user.findMany({
      where: { status: 'PENDING' },
      select: { id: true, name: true, email: true, requestedRole: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json(pending);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/auth/pending/:id/review - ADMIN only. Approves or rejects a
// pending registration. On approval, the user's real role is upgraded to
// whatever they requested and their account becomes ACTIVE.
async function reviewPendingUser(req, res, next) {
  try {
    const { id } = req.params;
    const { decision } = req.body; // "APPROVED" or "REJECTED"

    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ error: 'decision must be APPROVED or REJECTED' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.status !== 'PENDING') {
      return res.status(400).json({ error: 'This user has already been reviewed' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        status: decision === 'APPROVED' ? 'ACTIVE' : 'REJECTED',
        role: decision === 'APPROVED' ? user.requestedRole : user.role,
      },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/contractors - GOVT_EMPLOYEE/ADMIN only.
// Returns a simple list of registered, active contractors, so an employee
// can pick one when registering or assigning a project.
async function listContractors(req, res, next) {
  try {
    const contractors = await prisma.user.findMany({
      where: { role: 'CONTRACTOR', status: 'ACTIVE' },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
    res.json(contractors);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, createStaffUser, listPendingUsers, reviewPendingUser, listContractors };