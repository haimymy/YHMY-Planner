// pages/api/projects/[projectId]/permissions.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {


    const { projectId } = req.query;
    const { assigneeName, accessType } = req.body;

    try {
        await prisma.access.updateMany({
            where: { assigneeName, projectId: parseInt(projectId) },
            data: { accessType },
        });
        res.status(200).json({ message: 'Permissions updated successfully' });
    } catch (error) {
        console.error('Error updating permissions:', error);
        res.status(500).json({ error: 'An error occurred while updating permissions' });
    }
}
