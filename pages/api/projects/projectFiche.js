import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { projectId } = req.query;

    try {
        const parsedProjectId = parseInt(projectId, 10); // Parse projectId as an integer
        console.log(parsedProjectId);
        if (isNaN(parsedProjectId)) {
            return res.status(400).json({ error: 'Invalid projectId' }); // Handle invalid projectId
        }

        const project = await prisma.project.findUnique({
            where: { id: parsedProjectId },
            include: {
                manager: { select: { name: true } }, // Include the manager's name
                tasks: {
                    include: {
                        author: { select: { name: true } }, // Include the author's name for each task
                        assignee: { select: { name: true } } // Include the assignee's name for each task
                    }
                },
                accesses: true // Include the accesses associated with the project
            }
        });

        if (!project) {
            return res.status(401).json({ error: 'Project doesn\'t exist' });
        }
        console.log(project)
        return res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ error: 'An error occurred while fetching project' });
    }
}

