// api/[userName].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { userName } = req.query;

    try {
        /*const user = await prisma.user.findUnique({
            where: { name: userName,},
            include: {
                projects: {
                    where: {
                        OR: [
                            { managerName: userName }, // Projects created by the user
                            { tasks: { some: { assignees: { some: { userName: userName } } } } } // Projects with tasks assigned to the user
                        ]
                    },
                },
            },
        });*/
        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { managerName: userName }, // Projects created by the user
                    { accesses: { some: { employeeName: userName } } } // Projects with access for the user
                ]
            },
            include: {
                accesses: true // Include the accesses related to each project
            }
        });

        if (!projects) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(projects);
        return res.status(200).json({ projects: projects });
    } catch (error) {
        console.error('Error fetching user projects:', error);
        return res.status(500).json({ error: 'An error occurred while fetching user projects' });
    }
}
