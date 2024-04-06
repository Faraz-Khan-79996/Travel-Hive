const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')
//makes passport easier to use with mongoose.
//it's a plugin which makes it easier to use mongoose 
//with 'passport' with local strategy

const userSchema = new Schema({
    email :{
        type : String,
        required : true,
    }
})


userSchema.plugin(passportLocalMongoose)
//passport-local-mongoose will add 'username', 'hash' and 'salt' fields in schema.
//it will also add methods to your schema. See the docs

module.exports = mongoose.model("User" , userSchema)

