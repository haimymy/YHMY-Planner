import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { projectId } = req.query;

    try {
        // Fetch all accesses related to the project along with the associated user details
        const projectAccesses = await prisma.access.findMany({
            where: { projectId: parseInt(projectId) },
            include: {
                employee: true // Include user details
            }
        });

        res.status(200).json(projectAccesses);
    } catch (error) {
        console.error('Error fetching project accesses:', error);
        res.status(500).json({ error: 'An error occurred while fetching project accesses' });
    }
}
