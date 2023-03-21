import { prisma } from '../config/prisma.config.js';

export const createLesson = async (req, res) => {
    try {
        const lesson = await prisma.lesson.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                lessonUrl: req.body.lessonUrl,
                module: req.body.module
            }
        })
        res.json({
            message: 'Лекция создана'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать пост'
        })
    }
}

export const getLessons = async (req, res) => {
    try {
        const lessons = await prisma.lesson.findMany()
    } catch {
        console.log(err)
        res.status(500).json({
            message: "Что то пошло не так!"
        })
    }
}