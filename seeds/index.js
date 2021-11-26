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
       const distance = Math.floor(Math.random()*20)+ 10;
       const route = new Route({
           author: '619bb05f60ae8bbf2f1abdbe',
           location: `${cities[random10].city}, ${cities[random10].state}`,
           title: `${sample(descriptors)} ${sample(places)}`,
           description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
           distance,
           images: [
            {
              url: 'https://res.cloudinary.com/dbhqpzu2o/image/upload/v1637862010/BikeRoutes/et74pyd1zzmngrk5vhf4.jpg',
              filename: 'BikeRoutes/et74pyd1zzmngrk5vhf4',
            },
            {
              url: 'https://res.cloudinary.com/dbhqpzu2o/image/upload/v1637862027/BikeRoutes/tvhliueqe7egqydzpsph.jpg',
              filename: 'BikeRoutes/tvhliueqe7egqydzpsph',
            },
            {
              url: 'https://res.cloudinary.com/dbhqpzu2o/image/upload/v1637862034/BikeRoutes/pnde6zleuhofzm05faeq.jpg',
              filename: 'BikeRoutes/pnde6zleuhofzm05faeq',
            }
          ]
       })
       await route.save();
    }
}
seedDB();