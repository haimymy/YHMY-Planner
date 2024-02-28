// pages/api/users.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const projectId = router.query.userName;
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const users = await prisma.task.findMany({
            where:{
                projectId
            }
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'An error occurred while fetching users' });
    }
}
