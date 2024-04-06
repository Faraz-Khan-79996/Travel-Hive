const joi=require("joi");

//That's how you create a schema using joi
//below code means the IF given object has key 'a', it should be a string.
// const schema = Joi.object({
//     a: Joi.string()
// });

//joi.object( req.body )
//We're validating req.body
//It should have a listing object.
//inside the listing object, we're validating the keys.
module.exports.listingSchema=joi.object(
    {
        listing : joi.object({
            title : joi.string().required(),
            description : joi.string().required(),
            location : joi.string().required(),
            country : joi.string().required(),
            price : joi.number().required().min(0),
            image : joi.string().allow("",null),
        }
    ).required(),
});


//joi.object( req.body )
//We're validating req.body
//It should have a 'review' object.
//inside the 'review' object, we're validating the keys.
module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating : joi.number().required().min(0).max(5),
        comment : joi.string().required(),
    }).required()
})