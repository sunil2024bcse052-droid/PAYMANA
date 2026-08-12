// Catches any error thrown or passed via next(err) and returns a consistent JSON shape.
// Keeps controllers clean - they can just `throw` or call `next(err)`.
function errorHandler(err, req, res, next) {
  console.error(err);

  // Prisma "record not found" style errors
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  // Prisma unique constraint violation (e.g. duplicate email)
  if (err.code === 'P2002') {
    return res.status(409).json({ error: `Duplicate value for field: ${err.meta?.target}` });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;