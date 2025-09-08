const {Admin,Teacher,Student} = require('../models/users')
const {generateToken} = require('../services/authentication')

async function handleLogin(req,res) {
    const {role,username,password} = req.body
    
    try {
        let user = null
        if(role == 'admin'){
            user = await Admin.findOne({userName: username, password: password})
            user.role = 'admin'
            res.cookie('id',user._id)
        } else if(role == 'student'){
            user = await Student.findOne({userName: username, password: password})
            user.role = 'student'
            res.cookie('id',user._id)
        } else if(role == 'teacher'){
            user = await Teacher.findOne({userName: username, password: password})
            user.role = 'teacher'
            res.cookie('id',user._id)
        }
        
        const token = generateToken(user)
        res.cookie('token',token)
        res.cookie('role',user.role)
        res.redirect('/dashboard')
        return

    } catch (error) {
        return res.render('loginForm.ejs',{
            err: 'Invalid Login Credentials'
        })
    }
}

module.exports = handleLogin