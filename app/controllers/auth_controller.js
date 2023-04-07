import { validationResult } from "express-validator";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from "../config/prisma.config.js";

export const login = async (req, res) => {
    try {
      const user = await prisma.user.findUnique({where: {email: req.body.email}})

        if (!user) {
            return res.status(401).json({
                message: 'Неверное имя пользователя или пароль'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.password)

        if (!isValidPass) {
            return res.status(401).json({
                message: 'Неверное имя пользователя или пароль'
            })
        }
        if (!user.payed) {
            return res.status(401).json({
                message: 'Доступ запрещен'
            })
        }
        const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
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
            message: 'Не удалось авторизоваться',
            e
        })
    }
}

export const register = async (req, res) => {
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
                password: passwordHash,
                role: req.body.role || 'User',
                payed: req.body.payed || false
            }
        })
        const {password, ...userData} = newUser
        res.json({
            ...userData
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}

export const me = async (req, res) => {
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
}