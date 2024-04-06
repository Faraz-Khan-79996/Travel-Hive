const express = require('express')
const router = express.Router({mergeParams : true})
//makes req.params of the parent available here.
//that is the parameters in mount path, which in this case is
//app.use('/listing/:id/reviews' , reviews). :id will now be available
const {validateReview , isReviewAuthor , isLoggedIn} = require('../middleware.js')
const wrapAsync = require('../utils/wrapAsync.js')

const reviewController = require('../controller/review.js')


//Reviews
//Post review route
router.post('/', isLoggedIn ,validateReview, wrapAsync(reviewController.createReview))

//DELETE review route
router.delete('/:reviewId', isLoggedIn,isReviewAuthor, reviewController.destroyReview)

module.exports = router
