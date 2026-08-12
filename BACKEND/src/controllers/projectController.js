const prisma = require('../utils/prisma');

// GET /api/projects?state=&category=&status=&search=&page=1&limit=20
// Public route - no auth required. Only returns fields safe for public view.
async function listProjects(req, res, next) {
  try {
    const { state, category, status, search } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const where = {};
    if (state) where.state = state;
    if (category) where.category = category.toUpperCase();
    if (status) where.status = status.toUpperCase();
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { agency: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { budget: true },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      data: projects,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/:id
// Public route - full detail page including approved milestones and sources.
async function getProject(req, res, next) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        budget: true,
        milestones: { orderBy: { date: 'asc' } },
        sources: true,
        editLogs: { orderBy: { createdAt: 'desc' } },
        registeredBy: { select: { name: true } },
        contractor: { select: { name: true } },
      },
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
}

// POST /api/projects
// Restricted to GOVT_EMPLOYEE / ADMIN (see routes file).
async function createProject(req, res, next) {
  try {
    const {
      name, description, category, state, district, agency,
      startDate, plannedDeadline, contractorId,
      sanctionedAmount, fundingSource, latitude, longitude,
    } = req.body;

    if (!name || !category || !state || !agency || !sanctionedAmount) {
      return res.status(400).json({
        error: 'name, category, state, agency and sanctionedAmount are required',
      });
    }

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          name,
          description,
          category: category.toUpperCase(),
          state,
          district,
          agency,
          startDate: startDate ? new Date(startDate) : null,
          plannedDeadline: plannedDeadline ? new Date(plannedDeadline) : null,
          latitude,
          longitude,
          registeredById: req.user.id,
          contractorId: contractorId || null,
          budget: {
            create: {
              sanctionedAmount,
              fundingSource: fundingSource || 'central',
            },
          },
        },
        include: { budget: true },
      });

      await tx.editLog.create({
        data: {
          projectId: created.id,
          userId: req.user.id,
          action: 'created',
          diff: { name, sanctionedAmount },
        },
      });

      return created;
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/projects/:id
// Restricted to GOVT_EMPLOYEE / ADMIN. Writes an EditLog diff on every change.
async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id }, include: { budget: true } });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const allowedFields = [
      'name', 'description', 'status', 'percentComplete',
      'revisedDeadline', 'completedDate', 'contractorId',
    ];
    const updateData = {};
    const diff = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        const oldValue = existing[field];
        const newValue = field.includes('Date') || field.includes('Deadline')
          ? new Date(req.body[field])
          : req.body[field];
        updateData[field] = newValue;
        diff[field] = { from: oldValue, to: newValue };
      }
    }

    // Budget fields live on a related table, handled separately
    const budgetFields = ['releasedAmount', 'utilizedAmount'];
    const budgetUpdate = {};
    for (const field of budgetFields) {
      if (req.body[field] !== undefined) {
        budgetUpdate[field] = req.body[field];
        diff[field] = { from: existing.budget?.[field], to: req.body[field] };
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const proj = await tx.project.update({ where: { id }, data: updateData, include: { budget: true } });

      if (Object.keys(budgetUpdate).length > 0) {
        await tx.budget.update({ where: { projectId: id }, data: budgetUpdate });
      }

      await tx.editLog.create({
        data: { projectId: id, userId: req.user.id, action: 'updated', diff },
      });

      return proj;
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/projects/:id
// Restricted to ADMIN only.
async function deleteProject(req, res, next) {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/stats/summary
// Public route - powers the dashboard numbers.
async function getStats(req, res, next) {
  try {
    const [statusCounts, totalBudget, delayedCount] = await Promise.all([
      prisma.project.groupBy({ by: ['status'], _count: true }),
      prisma.budget.aggregate({ _sum: { sanctionedAmount: true, utilizedAmount: true } }),
      prisma.project.count({
        where: {
          status: { not: 'COMPLETED' },
          revisedDeadline: { lt: new Date() },
        },
      }),
    ]);

    res.json({
      byStatus: statusCounts,
      totalSanctioned: totalBudget._sum.sanctionedAmount || 0,
      totalUtilized: totalBudget._sum.utilizedAmount || 0,
      delayedCount,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject, getStats };