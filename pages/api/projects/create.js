// pages/api/projects.js
import { PrismaClient } from '@prisma/client';
import {console} from "next/dist/compiled/@edge-runtime/primitives";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    console.log(req);
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { title, description, userName } = req.body;
console.log(title, description, userName);
    try {
        const project = await prisma.project.create({
            data: {
                title,
                description,
                managerName: userName
            },
        });

        return res.status(201).json({ message: 'Project added successfully', project });
    } catch (error) {
        console.error('Error adding project:', error);
        return res.status(500).json({ error: 'An error occurred while adding project' });
    }
}
