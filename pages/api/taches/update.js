import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const tasksWithAssignees = req.body;

    try {
        const { assignees, ...taskData } = tasksWithAssignees;

        // Update the task
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(req.body.id) },
            data: taskData,
        });

        // Delete existing task assignments
        await prisma.taskAssignment.deleteMany({
            where: { taskId: parseInt(req.body.id) }
        });

        // Create new task assignments
        const createdAssignees = await Promise.all(assignees.map(async (assignee) => {
            const createdAssignee = await prisma.taskAssignment.create({
                data: {
                    taskId: parseInt(req.body.id),
                    userName: assignee.userName
                }
            });
            return createdAssignee;
        }));

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'An error occurred while updating task' });
    }
}
