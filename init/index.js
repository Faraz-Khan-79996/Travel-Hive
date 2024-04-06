const dataFile = require('./data')
const mongoose = require('mongoose')
const Listing = require('../models/listing');
require('dotenv').config()

main().catch(err => console.log(err));
async function main() {
  // await mongoose.connect("mongodb://localhost:27017/wanderlust");
  await mongoose.connect(process.env.MONGO_URL);
  console.log('data base connected');
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(dataFile.data)
    // console.log(dataFile.data);
}
initDb()