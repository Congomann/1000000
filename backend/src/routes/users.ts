import { Router } from 'express';
import prisma from '../prisma';
import { validate } from '../middleware/validate';
import { UserSchema } from '../schemas';

const router = Router();

// GET /api/users
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { deletedAt: null }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// POST /api/users
router.post('/', validate(UserSchema), async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: req.body
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT /api/users/:id
router.put('/:id', validate(UserSchema.partial()), async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.update({
            where: { id },
            data: req.body
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

export default router;
