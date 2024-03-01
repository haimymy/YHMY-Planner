import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { projectId } = req.query; // Assuming projectId is part of the query parameters
        console.log(projectId);
        const assignes = await prisma.access.findMany({
            where: { projectId: Number(projectId) }, // Assuming projectId is a number
            include: {
                assignee: {
                    select: {
                        name: true // Selecting only the 'name' field of the 'assignee'
                    }
                }
            },
        });
        return res.status(200).json(assignes);
    } catch (error) {
        console.error('Error fetching assignes:', error);
        return res.status(500).json({ error: 'An error occurred while fetching assignes' });
    }
}
