import { prisma } from '../config/prisma.config.js';

export const verifyUsers = async (req, res) => {
    try {
        
    } catch {
        res.status(500).json({
            message: "Что то пошло не так!"
        })
    }
}