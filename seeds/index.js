const mongoose = require('mongoose');
const cities = require('./cities');
const Routes = require('../models/routes');

mongoose.connect('mongodb://localhost:27017/bike-routes', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Routes.deleteMany({});
    for(let i = 0; i< 20; i++){
        const random10 = Math.floor(Math.random()*10);
        const route = new Routes({
            location: `${cities[random10].city}`
        })
        await route.save();
    }
}

seedDB();