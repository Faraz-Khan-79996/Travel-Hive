const express = require('express')
const middleware = require('../middleware.js')
const router = express.Router({ mergeParams: true })
//merge params is necessrary if you want to access the req.params of parent.

const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')//Custom error class
const { listingSchema, reviewSchema } = require('../schema.js')
const Listing = require('../models/listing.js')
const methodOverride = require('method-override')//For making request other than GET or POST from <form> directly

const listingController = require('../controller/listings.js')


const multer = require('multer')
const { storage } = require('../cloudConfig.js')
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })
//Instead of 'uploads/' folder, now multer stores image in cloudinary.

router.route('/')
    .get(wrapAsync(listingController.index))
    .post(
        middleware.isLoggedIn,
        // middleware.validateListing,
        upload.single('listing[image]'),//uploading file in cloudinary
        wrapAsync(listingController.createListing)
    )



// .post(upload.single('listing[image]'),(req , res)=>{
//     res.send(req.file)
// })

//New route
//Make sure to put it above, otherwise value new will go in ID
router.get('/new', middleware.isLoggedIn, listingController.renderNewForm)

router.route('/:id')
    .put(
        middleware.isLoggedIn,
        middleware.isOwner,
        // middleware.validateListing,
        upload.single('listing[image]'),//uploading file in cloudinary
        wrapAsync(listingController.updateListing)
    )
    .get(wrapAsync(listingController.showListing))
    .delete(wrapAsync(listingController.destroyListing))






//Edit route
router.get('/:id/edit', middleware.isLoggedIn, wrapAsync(listingController.renderEditForm))



module.exports = router