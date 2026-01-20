import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

router.get('/metrics', async (req, res) => {
    try {
        // @ts-ignore
        const totalClients = await prisma.client.count();
        // @ts-ignore
        const pendingLeads = await prisma.lead.count({
            where: { status: 'New' }
        });

        // Calculate total revenue (premium)
        // @ts-ignore
        const revenueAgg = await prisma.client.aggregate({
            _sum: {
                premium: true
            }
        });

        res.json({
            totalRevenue: Number(revenueAgg._sum.premium || 0),
            activeClients: totalClients,
            pendingLeads: pendingLeads,
            monthlyPerformance: [
                { month: 'Jan', revenue: 45000, leads: 24 },
                { month: 'Feb', revenue: 52000, leads: 30 },
                { month: 'Mar', revenue: 48000, leads: 28 },
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
});

export default router;
