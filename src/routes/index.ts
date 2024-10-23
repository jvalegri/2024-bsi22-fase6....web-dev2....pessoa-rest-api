import express, { Router } from 'express'
import users from './users'
import token from './token'
import login from './login'

const router = Router()

router.use(express.json())
router.use(express.static(__dirname + '/../../public'))
  
router.use('/login', login)
router.use('/users', users)
router.use('/token', token)

export default router