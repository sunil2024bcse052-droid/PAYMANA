const prisma = require('../utils/prisma');

// POST /api/progress-updates
// Contractor submits a progress update - goes in as PENDING, doesn't touch
// the real Project data yet.
async function submitUpdate(req, res, next) {
  try {
    const { projectId, percentComplete, amountUtilized, notes, proofUrl } = req.body;

    if (!projectId || percentComplete === undefined || amountUtilized === undefined) {
      return res.status(400).json({
        error: 'projectId, percentComplete and amountUtilized are required',
      });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.contractorId !== req.user.id) {
      return res.status(403).json({ error: 'You are not assigned to this project' });
    }

    const update = await prisma.progressUpdate.create({
      data: {
        projectId,
        contractorId: req.user.id,
        percentComplete,
        amountUtilized,
        notes,
        proofUrl,
      },
    });

    res.status(201).json(update);
  } catch (err) {
    next(err);
  }
}

// GET /api/progress-updates/pending
// Govt employee views all pending submissions across all projects.
async function listPending(req, res, next) {
  try {
    const updates = await prisma.progressUpdate.findMany({
      where: { status: 'PENDING' },
      include: {
        project: { select: { name: true, id: true } },
        contractor: { select: { name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json(updates);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/progress-updates/:id/review
// Govt employee approves or rejects a pending update.
// On approval: updates the real Project + Budget data, inside a transaction.
async function reviewUpdate(req, res, next) {
  try {
    const { id } = req.params;
    const { decision, reviewNotes } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      return res.status(400).json({ error: 'decision must be APPROVED or REJECTED' });
    }

    const update = await prisma.progressUpdate.findUnique({ where: { id } });
    if (!update) return res.status(404).json({ error: 'Update not found' });
    if (update.status !== 'PENDING') {
      return res.status(400).json({ error: 'This update has already been reviewed' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const reviewed = await tx.progressUpdate.update({
        where: { id },
        data: {
          status: decision,
          reviewedById: req.user.id,
          reviewNotes,
          reviewedAt: new Date(),
        },
      });

      if (decision === 'APPROVED') {
        await tx.project.update({
          where: { id: update.projectId },
          data: { percentComplete: update.percentComplete },
        });

        await tx.budget.update({
          where: { projectId: update.projectId },
          data: { utilizedAmount: update.amountUtilized },
        });

        await tx.editLog.create({
          data: {
            projectId: update.projectId,
            userId: req.user.id,
            action: 'progress_approved',
            diff: {
              percentComplete: update.percentComplete,
              amountUtilized: update.amountUtilized,
            },
          },
        });
      }

      return reviewed;
    }, { timeout: 15000 });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/progress-updates/upload-proof
// Contractor uploads a proof photo, gets back a URL to include when
// submitting the actual progress update.
function uploadProof(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({ url: fileUrl });
}

module.exports = { submitUpdate, listPending, reviewUpdate, uploadProof };