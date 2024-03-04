
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { projectId } = req.body;

    try {
        await prisma.$transaction([
            prisma.access.deleteMany({
                where: {
                    projectId: parseInt(projectId),
                },
            }),
            prisma.taskAssignment.deleteMany({
                where: {
                    task: {
                        projectId: parseInt(projectId),
                    },
                },
            }),
            prisma.task.deleteMany({
                where: {
                    projectId: parseInt(projectId),
                },
            }),
            prisma.project.delete({
                where: {
                    id: parseInt(projectId),
                },
            }),
        ]);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'An error occurred while deleting project' });
    }
}
