import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST')  return res.status(405).json({ error: 'Method Not Allowed' });

    const { taskName, taskDescription, selectedUserName, selectedEffort, projectId, loggedInUser } = req.body;
    try {
        console.log(projectId);
        const newTask = await prisma.task.create({
            data: {
                title: taskName,
                description: taskDescription,
                projectId: parseInt(projectId, 10),
                assigneeName: selectedUserName,
                authorName: loggedInUser,
                effort: parseInt(selectedEffort, 10),
                status: 0, // Assuming the initial status is 0
            },
        });

        const countAssigneeTasks = await prisma.task.count({
            where: {
                projectId: parseInt(projectId, 10),
                assigneeName: selectedUserName,
            },
        });

        if (countAssigneeTasks === 1) {
            await prisma.access.create({
                data: {
                    assigneeName: selectedUserName,
                    projectId: parseInt(projectId, 10),
                    accessType: 'ls',
                },
            });
        }
        res.status(200).json({ newTask });

    } catch (error) {
        console.error('Error creating task with access:', error);
        throw error;
    }

}
