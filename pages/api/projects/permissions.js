import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    //const { projectId } = req.query;
    const { assigneeName, accessType, projectId } = req.body;

    try {
        // Update the accessType for the specified employeeName and projectId

        // First, delete the existing record
        await prisma.access.deleteMany({
            where: {
                projectId: parseInt(projectId, 10),
                employeeName: assigneeName
            }
        });

// Then, create a new record with the updated accessType
        const newAccess = await prisma.access.create({
            data: {
                projectId: parseInt(projectId, 10),
                employeeName: assigneeName,
                accessType: accessType
            }
        });



        res.status(200).json({ message: 'Access type updated successfully', newAccess });
    } catch (error) {
        console.error('Error updating access type:', error);
        res.status(500).json({ error: 'An error occurred while updating access type' });
    }
}
