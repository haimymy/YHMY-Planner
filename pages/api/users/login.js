// pages/api/login.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                name: username,
                password: password,
            },
            select: {
                name:true
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'An error occurred while logging in' });
    }
}
