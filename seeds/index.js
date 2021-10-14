const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places,} = require ('./seedHelpers');
const Route = require('../models/routes');

mongoose.connect('mongodb://localhost:27017/bike-routes', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Route.deleteMany({});
    for(let i = 0; i < 10; i++){
       const random10 =  Math.floor(Math.random()*10);
       const route = new Route({
           location: `${cities[random10].city}, ${cities[random10].state}`,
           title: `${sample(descriptors)} ${sample(places)}`
       })
       await route.save();
    }
}
seedDB();