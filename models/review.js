const {Schema , model} = require('mongoose')

const reviewSchema = new Schema({
    comment : String,
    rating : {
        type : Number,
        min : 0,
        max : 5,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
    },
    author :{
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

const Review = model('Review' , reviewSchema);
module.exports = Review;

