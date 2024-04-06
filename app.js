const express = require('express')
const mongoose = require('mongoose')
const Listing = require('./models/listing.js')
const Review = require('./models/review.js')
const path = require('path')
const methodOverride = require('method-override')//For making request other than GET or POST from <form> directly
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')//Custom error class
const { listingSchema, reviewSchema } = require('./schema.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

require('dotenv').config()
const app = express()

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const listingRouter = require('./routes/listing.js')
const reviewsRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

const mongostore = MongoStore.create({
    mongoUrl : process.env.MONGO_URL,
    crypto :{
        secret : "faraz the great",
    },
    touchAfter : 24 * 3600,//seconds
})

mongostore.on("error" , (err)=>{
    console.log("ERR in MONGO SESSION STORE : " , err)
})

const sessionOptions = {
    store : mongostore,//session info will be stored in atlas database.
    secret : "faraz the great",
    resave : false,
    saveUninitialized : true,
    cookie :{
        //You only have to write one of 'maxAge' and 'expires'.
        expires : Date.now() + 1*24*60*60*1000,//1 day
        maxAge : 1*24*60*60*1000,
        httpOnly : true,
    }
}


app.use(session(sessionOptions))
app.use(flash())

//'session' must be initialized before using passport.
//passport makes use of sessions, therefore it's manddatory to use it.
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
//users should be authenticated using Local-strategy.
//method for authentication is User.authenticate() which is in User model created 
//by passport-local-mongoose plugin inside userSchema.

//adding user related info in session is serializign user
//The methods are added to userSChema by passport-local-mongoose.
//We're using User model to invoke them.
passport.serializeUser(User.serializeUser())//to serialize user into the session
passport.deserializeUser(User.deserializeUser())//to serialize user into the session

//application level middlware.
//will execute at every request.
app.use((req , res , next) =>{

    //res.locals variables last only for that request.

    //If there're a 'success' flash message, it will 
    //get saved in 'success' as res.local.
    //returns array of flash messages under the key 'success'
    //returns empty array if no message with given key.
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    //There are multiple routes which create flash messages with given key, but 
    //after every refresh they go out of memory, therefore every time there is only 1 message in array
    //or either array is empty
    res.locals.currUser = req.user;
    //user is pushed in res.locals.
    //If user logged out, currUser undefined, else currUser will contain user info.
    //you can access currUser in your templates.
    next()
})

app.use('/listings' , listingRouter)
app.use('/listings/:id/reviews' , reviewsRouter)
app.use('/' , userRouter)
//:id will remain in app.js. only the path ahead of /listing/:id/reviews will go in reviews.
//To preserve req.params of the parent child to go in reviews router, use 
//const router = express.Router({mergeParams : true}) in review.js. req.params of the parent will now
//be available.



main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('data base connected');
}

//Middleware functions:-





app.get('/', (req, res) => {
    res.redirect('/listings')
})

//Test route to register user
app.get('/demouser' , async (req , res)=>{
    let fakeUser = new User({
        email : "farazthegreat@gmail.com",
        username : "Faraz the great",
    })

    //User.register method is added to schema by passport-local-mongoose.
    //automatically saves the user in collection.
    //also checks whether username is unique or not. username must be unique
    const new_user = await User.register(fakeUser , "password of the user")
    res.json(new_user)
})


app.get('/testListing', wrapAsync(async (req, res) => {
    const listingDoc = await Listing.create({
        title: "dfsdf",
        description: "sfsdfds",
        price: 200,
        location: "afdfsdf",
        country: "dsdfsdf",
        image: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    })
    // res.json(listingDoc)
}))


//If none of the above route match
app.all('*', (req, res, next) => {
    //Create a cutom error from our ExpressError class and throw.
    next(new ExpressError(404, "aisa koi route hi nai he"))
})

//error handling middleware
app.use((err, req, res, next) => {

    // const {statusCode=500 , message="default value of messages"} = err
    // res.status(statusCode).send(message)

    res.render('error', { err })
})


app.listen(3000 , ()=>{
    console.log("http://localhost:3000/listings");
})