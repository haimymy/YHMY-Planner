// /api/projects/assignees.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { projectId } = req.query;

    try {
        const assignees = await prisma.access.findMany({
            where: {
                projectId: parseInt(projectId),
            },
            include: {
                employee: true, // Include the user associated with the access
            },
            distinct: ['employeeName'],
            orderBy: {
                employeeName: 'asc', // Order by employeeName in ascending order
            },
        });

        const usersWithPermissions = assignees.map(assignee => ({
            userName: assignee.employeeName,
            accessType: assignee.accessType,
        }));

        res.status(200).json(usersWithPermissions);
    } catch (error) {
        console.error('Error fetching assignees:', error);
        res.status(500).json({ error: 'An error occurred while fetching assignees' });
    }
}
