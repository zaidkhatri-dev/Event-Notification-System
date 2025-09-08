const {verifyToken} = require('../services/authentication')

function checkToken(){
    return async (req,res,next) => {
        const cookieToken = req.cookies.token
        const role = req.cookies.role
        
        if(!cookieToken) {
            res.redirect('/')
        }

        try{
            const payload = verifyToken(cookieToken)
            req.user = {
                payload: payload,
                role: role
            }
            
            
            return next()
        }catch(err){
            return res.render('loginForm.ejs')
        }
    }
}

module.exports = checkToken