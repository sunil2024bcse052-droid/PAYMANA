const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

// POST /api/auth/register
// In a real deployment you'd lock this down (e.g. only ADMIN can create
// GOVT_EMPLOYEE / CONTRACTOR accounts). For now it's open so you can seed
// users while building - tighten this before anything goes public.
// POST /api/auth/register - PUBLIC self-registration.
// Always creates a VIEWER account, regardless of what role is sent in the
// request body - a member of the public cannot grant themselves elevated
// access. GOVT_EMPLOYEE/CONTRACTOR/ADMIN accounts can only be created by
// an existing admin, via createStaffUser below.
async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password and name are required' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: 'VIEWER' },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/staff - ADMIN ONLY. Creates a GOVT_EMPLOYEE, CONTRACTOR,
// or ADMIN account. This is how staff accounts actually get provisioned -
// nobody self-registers into these roles.
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
      data: { email, password: hashed, name, role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
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
module.exports = { register, login, createStaffUser };