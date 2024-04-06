const express = require('express')
const router = express.Router()
const passport = require('passport')
const middleware = require('../middleware.js')
const userController = require('../controller/user.js')


router.route('/signup')
.get( userController.renderSignupForm)
.post( userController.signup)


router.get('/login' , userController.renderLoginForm)


const options ={
    failureRedirect : '/login', //redirects if authentication fails. 
    failureFlash :true//creates a flash message under the key 'error'
    //It on it's own generates a relevent message.
}
//passport.authenticate() is for authentication.
//(strategy , options) are two parameters
//The middleware method automatically handles everything. It checks username and password from collection
//on it's own.(local strategy therefore username and password)
router.post('/login' , middleware.saveRedirectedUrl ,passport.authenticate("local" , options) ,userController.login)
// LocalStrategy's authentication function is called. 
// Passport's LocalStrategy is configured to check the 
//username and password against your database. 
//If the credentials are valid, it returns the user object.

//method for authentication is User.authenticate() which is in User model created 
//by passport-local-mongoose plugin.


router.get('/logout' , userController.logout)

module.exports = router
