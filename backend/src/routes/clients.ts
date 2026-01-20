import { Router } from 'express';
import prisma from '../prisma';
import { validate } from '../middleware/validate';
import { ClientSchema } from '../schemas';
import { authenticateToken } from '../middleware/auth';
import { sendEmail } from '../services/email';

const router = Router();

// GET /api/clients
// @ts-ignore
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { advisorId } = req.query;
        const where = advisorId ? { advisorId: String(advisorId) } : {};

        // @ts-ignore
        const clients = await prisma.client.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(clients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});

// POST /api/clients
router.post('/', validate(ClientSchema), async (req, res) => {
    try {
        // @ts-ignore
        const client = await prisma.client.create({
            data: req.body
        });

        // Send Welcome Email
        if (client.email) {
            await sendEmail(
                client.email,
                'Welcome to NHFG',
                `<h1>Welcome ${client.name}!</h1><p>We are excited to have you on board.</p>`
            );
        }

        res.status(201).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create client' });
    }
});

export default router;
