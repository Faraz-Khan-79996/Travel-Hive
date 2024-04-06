const {Schema , model} = require('mongoose')
const Review = require('./review')

const listingSchema = new Schema({
    title : {
        type : String
    },
    description :{
        type : String
    },
    image :{
       url : String,
       filename : String,
    },
    price : {
        type : Number,
    },
    location :{
        type : String,
    },
    country : {
        type : String,
    },
    reviews :[
        {
            type : Schema.Types.ObjectId,
            ref : 'Review',
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : 'User',
    } 
})

//deleting all the reviews associated with listing
listingSchema.post("findOneAndDelete" , async(listing)=>{

    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = model('Listing' , listingSchema)
module.exports = Listing

