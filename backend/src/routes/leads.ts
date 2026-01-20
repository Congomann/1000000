import { Router } from 'express';
import prisma from '../prisma';
import { validate } from '../middleware/validate';
import { LeadSchema } from '../schemas';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/leads
// @ts-ignore
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { advisorId } = req.query;
        const where = advisorId ? { assignedTo: String(advisorId) } : {};

        // @ts-ignore - Prisma types might not be fully generated yet
        const leads = await prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// POST /api/leads
router.post('/', validate(LeadSchema), async (req, res) => {
    try {
        // @ts-ignore
        const lead = await prisma.lead.create({
            data: req.body
        });
        res.status(201).json(lead);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create lead' });
    }
});

export default router;
