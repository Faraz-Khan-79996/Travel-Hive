const User = require('../models/user')


module.exports.renderSignupForm = (req , res)=>{
    res.render("users/signup")
}

module.exports.renderLoginForm = (req , res)=>{
    res.render('users/login')
}


module.exports.signup = async(req , res , next)=>{
    try {
        let {username , email , password} = req.body
        const new_user = new User({email , username});
        const userDoc = await User.register(new_user , password)//will automatically check if username is unique or not.
        //register() method added by passport-local-mongoose
        //will register user in database as well.

        //login the user after signup
        req.login(userDoc , (err)=>{
            if(err){
                return next(err)
                //return causes the function to end
            }
            req.flash('success' , "signup successfull!")
            res.redirect('/listings')
        })
    } catch (error) {
        // next(error)
        req.flash("error" , error.message)
        res.redirect('/signup')
    }
}

module.exports.login = async (req , res , next)=>{

    // In this route, passport.authenticate() is middleware which will authenticate the request. 
    // By default, when authentication succeeds, the req.user property is set to the authenticated user, 
    // a login session is established, and the next function in the stack is called. 
    //passport.authenticate() invokes passport.login() on it's own internally.
    // console.log(Object.keys(req));
    // console.log(req.user); user field is created which contains user info
    req.flash('success' , "You are logged in!")
    // res.redirect('/listings')
    const redirectUrl = res.locals.redirectUrl?res.locals.redirectUrl : '/listings'
    //If there's no re-direct Url, then go to '/lisintgs'
    res.redirect(redirectUrl)
}


module.exports.logout = (req , res)=>{
    
    //This method is by 'passport'. it takes a callback with error parameter.
    // will remove req.user and remove user from session
    req.logout((err)=>{
        if(err){
            return next(err)
            //returning next so that code below does not execute.
        }
        req.flash("success" , "You are logged out!")
        res.redirect('/listings')
    })
}