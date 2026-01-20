import { Router } from 'express';
import prisma from '../prisma';
import { validate } from '../middleware/validate';
import { LoginSchema } from '../schemas';
import { generateToken } from '../middleware/auth';

const router = Router();

router.post('/login', validate(LoginSchema), async (req, res) => {
    const { email } = req.body;
    try {
        // In a real app this would verify password hash with bcrypt
        // const match = await bcrypt.compare(password, user.passwordHash)
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            // @ts-ignore
            const token = generateToken(user);
            res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    category: user.category,
                    avatar: user.avatar,
                    productsSold: user.productsSold
                },
                token
            });
        } else {
            res.status(401).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Auth failed' });
    }
});

export default router;
