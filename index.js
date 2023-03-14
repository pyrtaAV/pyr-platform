import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt'

import { registerValidator } from "./middleware/validations.js";
import checkAuth from "./middleware/checkAuth.js";

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
dotenv.config()

app.post('/auth/login', async (req, res) => {
    try {
      const user = await prisma.user.findUnique({where: {email: req.body.email}})

        if (!user) {
            return res.status(401).json({
                message: 'Неверное имя пользователя или пароль'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.password)

        if (!isValidPass) {
            res.status(401).json({
                message: 'Неверное имя пользователя или пароль'
            })
        }
        const token = jwt.sign({
                id: user.id,
                email: user.email
            }, process.env.ACCESS_TOKEN,
            {
                expiresIn: '30d'
            })
        const {password, ...userData} = user
        res.json({
            ...userData,
            token
        })
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
})
app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        const newUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: passwordHash
            }
        })
        const token = jwt.sign({
            id: newUser.id,
            email: newUser.email
        }, process.env.ACCESS_TOKEN,
            {
                expiresIn: '30d'
            })
        const {password, ...userData} = newUser
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
})
app.get('/auth/me', checkAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({where: {id: req.userId}})
        if (!user) {
            return res.status(401).json({
                message: 'Пользователь не найден'
            })
        }
        const {password, ...userData} = user
        res.json({
            ...userData
        })
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
})
app.post('/lessons', checkAuth, async (req, res) => {
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
})
app.get('/hello', (req, res) => {
    res.send("Hello from PYR Rest")
})
async function main() {
    app.listen(4445, () => {
        console.log('Server starting on port: 4445')
    })
}

main()
    .then(async () => { await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
