const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {routeSchema} = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Route = require('./models/routes');

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

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateRoute = (req,res,next) => {
    const { error } = routeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/routes', catchAsync(async (req, res,) => {
    const routes = await Route.find({});
    res.render('routes/index', { routes })
}));

app.get('/routes/new', catchAsync(async (req, res,) => {
    res.render('routes/new');
}));

app.post('/routes',validateRoute, catchAsync(async (req, res,) => {

    const route = new Route(req.body.route);
    await route.save();
    res.redirect(`/routes/${route._id}`)
}));

app.get('/routes/:id', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id)
    res.render('routes/show', { route });
}));

app.get('/routes/:id/edit', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id)
    res.render('routes/edit', { route });
}));

app.put('/routes/:id',validateRoute, catchAsync(async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndUpdate(id, { ...req.body.route }) //spread object
    res.redirect(`/routes/${route._id}`)
}));

app.delete('/routes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Route.findByIdAndDelete(id)
    res.redirect('/routes');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});