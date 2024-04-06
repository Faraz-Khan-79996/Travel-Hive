const Listing = require('./models/listing')
const Review = require('./models/review')
const { reviewSchema , listingSchema } = require('./schema.js')
const ExpressError = require('./utils/ExpressError.js')//Custom error class


//Validates incoming data, next() if all good, else throw error.
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    //validates the given object with schema defined in schema.js using joi.

    if (error) {

        //error has multiple details, map over them and join there message with ','
        const errMsg = error.details.map((el) => el.message).join(', ')
        throw new ExpressError(400, errMsg)
    }
    next()
}

module.exports.validateReview =  (req, res, next) => {

    let { error } = reviewSchema.validate(req.body)

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}


module.exports.isLoggedIn  = (req , res , next)=>{

    console.log("current path : " , req.path , " AND originalUrl : " , req.originalUrl);

    //req.isAuthenticated() is added by passport. Checks whether the user is authenticated or not.
    //logging in is done by passport.authenticate("local" , options) which is implemented in user controller.
    //passport.authenticate("local" , options) adds req.user to the request object and in session
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;//In case not logged in, save original intended Url to session.
        req.flash("error" , "you must be logged in!")
        return res.redirect('/login')
    }
    next()
}

//If there's a re-direct Url in session, save to res.locals
module.exports.saveRedirectedUrl  = (req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req , res , next)=>{
    const {id} = req.params

    const listingDoc = await Listing.findById(id)
    if(!(req.user && req.user._id.equals(listingDoc.owner))){
        req.flash("error" , "You are not authorized")
        return res.redirect('/listings/'+id)
    }
    next()
}
module.exports.isReviewAuthor = async (req , res , next)=>{
    const {id , reviewId} = req.params

    const reviewDoc = await Review.findById(reviewId)
    if(!(req.user && req.user._id.equals(reviewDoc.author))){
        req.flash("error" , "Not your Review!")
        res.redirect('/listings/'+id)
        return;
    }
    next()
}