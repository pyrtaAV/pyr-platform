import express from 'express'
import dotenv from 'dotenv'

import { registerValidator } from "./middleware/validations.js";
import checkAuth from "./middleware/checkAuth.js";
import { login, me, register } from './controllers/auth_controller.js';
import { prisma } from './config/prisma.config.js';
import { createLesson, getLessons } from './controllers/lessons_controller.js';
import isAdmin from './middleware/isAdmin.js';
import { verifyUsers } from './controllers/admin_controller.js';

const app = express()

app.use(express.json())
dotenv.config()

app.post('/auth/login', login)
app.post('/auth/register', registerValidator, register)
app.get('/auth/me', checkAuth, me)
app.post('/lessons', checkAuth, isAdmin, createLesson)
app.get('/lessons/',checkAuth, getLessons)
app.get('/admin', checkAuth, isAdmin, verifyUsers)

async function main() {
    app.listen(3000, () => {
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
