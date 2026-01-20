import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@nhfg.com' },
        update: {},
        create: {
            email: 'admin@nhfg.com',
            name: 'Admin User',
            role: 'Administrator',
            passwordHash,
            category: 'Admin',
            productsSold: ['Life Insurance', 'Real Estate']
        }
    });

    // 2. Create Advisor
    const advisor = await prisma.user.upsert({
        where: { email: 'advisor@nhfg.com' },
        update: {},
        create: {
            email: 'advisor@nhfg.com',
            name: 'Jane Advisor',
            role: 'Advisor',
            passwordHash,
            category: 'Insurance & General',
            productsSold: ['Life Insurance']
        }
    });

    console.log({ admin, advisor });

    // 3. Create Leads
    await prisma.lead.createMany({
        data: [
            {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '555-0101',
                interest: 'Life Insurance',
                status: 'New',
                assignedTo: advisor.id,
                source: 'google_ads',
                score: 85
            },
            {
                name: 'Alice Smith',
                email: 'alice@example.com',
                phone: '555-0102',
                interest: 'Real Estate',
                status: 'Contacted',
                assignedTo: advisor.id,
                source: 'meta_ads',
                score: 70
            }
        ],
        skipDuplicates: true
    });

    // 4. Create Client
    await prisma.client.create({
        data: {
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '555-0103',
            advisorId: advisor.id,
            product: 'Life Insurance',
            policyNumber: 'POL-123456',
            premium: 1200.00,
            carrier: 'Pacific Life'
        }
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
