import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { tacheId } = req.query;
    console.log(tacheId);
    try {

        const tasksWithAssignees = await prisma.task.findUnique({
            where: { id: parseInt(tacheId,10) },
            include: { assignees: true },
        });
        console.log(tasksWithAssignees);
        res.json(tasksWithAssignees);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'An error occurred while fetching tasks' });
    }
}
