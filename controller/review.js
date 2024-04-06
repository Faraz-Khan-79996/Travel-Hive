const express = require('express')
const Listing = require('../models/listing.js')
const Review = require('../models/review.js')


module.exports.createReview = async (req, res) => {

    //Finding the listing for which this review is for
    const id = req.params.id;
    const listing = await Listing.findById(id)

    //Create a review document in database
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)
    //pushing the Review type object in listing.
    //implementing one to many.

    newReview.author = req.user._id
    //author is user which is logged in.

    const r = await newReview.save()
    const l = await listing.save()
    req.flash('success', "Review Created successfully!")
    // res.json({l , r})
    res.redirect(`/listings/${id}`)
}


module.exports.destroyReview = async (req, res) => {
    //Function to remove 1 review from listing.
    //remove review from listing Doc.
    //also remove from review collection.


    //remove the reviewId from 'reviews' array of listing and update it.
    //remove 'reviewId' from collection 

    try {
        //id is _id of listing and reviewId is the _id of review document in colection
        const { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId }
            //pulls out from the reviews array the ObjectId 'reviewId'
        });
        await Review.findByIdAndDelete(reviewId)
        req.flash('success', "Review Deleted successfully!")
        res.redirect(`/listings/${id}`)
    } catch (error) {
        next(error)
    }
}

