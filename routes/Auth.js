import express from 'express'
import { CheckUser, Login, Logout, register,forgotPassword,resetPassword } from '../controllers/Auth.js'
import {IsUser} from '../middleware/verifyToken.js'

const AuthRoutes=express.Router()

AuthRoutes.post('/register',register)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.get('/CheckUser',IsUser,CheckUser)
AuthRoutes.post('/forgot-password',forgotPassword)
AuthRoutes.post('/reset-password',resetPassword)

export default AuthRoutes