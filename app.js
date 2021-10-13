const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Route = require('./models/routes')

mongoose.connect('mongodb://localhost:27017/bike-routes', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

// app.get('/makebikeroute', async (req,res)=> {
//     const route = new Route({title:'A20', location:"małopolska" });
//     await route.save();
//     res.send(route)
// })

app.listen(3000, () => {
    console.log('Serving on port 3000')
})