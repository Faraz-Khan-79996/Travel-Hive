const Listing = require('../models/listing.js')


module.exports.index = async (req, res) => {
    const allListings = await Listing.find()
    res.render('listings/index.ejs', { allListings })
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new')
}

module.exports.createListing = async (req, res, next) => {


    // let {title , description , price , country , image , location} = req.body;
    // const listing = {
    //     title,description,price,country,image,location
    // }

    //No need as validation handled by middleware
    // if(!req.body.listing){
    //     throw new ExpressError(400 , "no object named listing received")
    // }

    //inside the new.ejs form, we've done <input name="listing[price]">
    //Therefore price will be a part of listing object.
    const listing = req.body.listing;
    listing.owner = req.user._id//made possible by passport

    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};

    const listingDoc = await Listing.create(listing)
    req.flash('success' , "Listing created successfully")
    //creating a flash message after creating a listing
    res.redirect(`/listings`)

}

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id)
        .populate({
            path : 'reviews',
            populate: {
                path : 'author',
            },
        })
        .populate("owner");
        
        if(!listing){
            req.flash('error' , "Listing you requested does not exist")
            res.redirect('/listings')
        }
        else{
            res.render('listings/show', { listing })
        }
    } catch (error) {
        console.log(error);
    }

}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)

    if(!listing){
        req.flash('error' , "Listing you requested does not exist")
        res.redirect('/listings')        
    }
    else{
        res.render('listings/edit', { listing })
    }
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listingDoc = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
    })

    //If there's no file in req, skip this part.
    //else uptade image field and save.
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listingDoc.image = {url , filename};

        listingDoc.save()
    }

    // console.log(req.body.listing);
    req.flash('success' , "Listing Updated successfully!")
    res.redirect('/listings/' + id)
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash('success' , "Listing deleted Successfully!")
    res.redirect('/listings')
}