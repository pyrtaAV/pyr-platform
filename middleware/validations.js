import { body } from 'express-validator'

export const registerValidator = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть не менее 5-ти символов').isLength({ min: 5 }),
]