import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { taskId } = req.body;

    try {
        await prisma.taskAssignment.deleteMany({
            where: {
                taskId: parseInt(taskId)
            }
        });

        await prisma.task.delete({
            where: {
                id: parseInt(taskId)
            }
        });

        res.status(200).json({ message: 'Task and associated TaskAssignments deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'An error occurred while deleting task' });
    }
}
