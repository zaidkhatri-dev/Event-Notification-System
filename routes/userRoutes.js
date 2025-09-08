const express = require('express')
const userRouter = express.Router()

const handleLogin = require('../controllers/users')

userRouter.route('/')
.post(handleLogin)
.get((req,res)=>{
    res.render('loginForm.ejs')
})

userRouter.route('/logout')
.post((req,res)=>{
    res.clearCookie('id')
    res.clearCookie('role')
    res.clearCookie('token')

    return res.redirect('/')
})

module.exports = userRouter