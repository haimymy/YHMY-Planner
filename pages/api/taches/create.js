import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { taskName, taskDescription, selectedUserNames, selectedEffort, projectId, loggedInUser } = req.body;

    try {
        // Create the task
        const newTask = await prisma.task.create({
            data: {
                title: taskName,
                description: taskDescription,
                projectId: parseInt(projectId, 10),
                authorName: loggedInUser,
                effort: parseInt(selectedEffort, 10),
                status: '0', // Assuming the initial status is '0'
            },
            include: {
                assignees: true,
            },
        });

        // Create assignees for the task
        for (const userName of selectedUserNames) {
            await prisma.taskAssignment.create({
                data: {
                    taskId: newTask.id,
                    userName,
                },
            });
        }

        // Grant access permission 'ls' to users if it's their first task for the project
        for (const userName of selectedUserNames) {
            const countAssigneeTasks = await prisma.taskAssignment.count({
                where: {
                    taskId: newTask.id,
                    userName,
                },
            });

            if (countAssigneeTasks === 1) {
                await prisma.access.create({
                    data: {
                        employeeName: userName,
                        projectId: parseInt(projectId, 10),
                        accessType: 'ls',
                    },
                });
            }
        }

        res.status(200).json({ newTask });
    } catch (error) {
        console.error('Error creating task with access:', error);
        res.status(500).json({ error: 'Error creating task with access' });
    }
}
