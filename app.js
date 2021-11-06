const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {routeSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Route = require('./models/routes');
const Review = require('./models/review');

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

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

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

const validateReview = (req,res,next)=> {
    const {error} = reviewSchema.validate(req.body);
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

app.get('/routes/new', (req, res,) => {
    res.render('routes/new');
});

app.post('/routes', validateRoute, catchAsync(async (req, res, next) => {

    const route = new Route(req.body.route);
    await route.save();
    res.redirect(`/routes/${route._id}`)
}));

app.get('/routes/:id', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id).populate('reviews');
    res.render('routes/show', { route });
}));

app.get('/routes/:id/edit', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id)
    res.render('routes/edit', { route });
}));

app.put('/routes/:id', validateRoute, catchAsync(async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndUpdate(id, { ...req.body.route }) //spread object
    res.redirect(`/routes/${route._id}`)
}));

app.delete('/routes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Route.findByIdAndDelete(id)
    res.redirect('/routes');
}));

app.post('/routes/:id/reviews',validateReview, catchAsync(async(req,res)=> {
    const route = await Route.findById(req.params.id);
    const review = new Review(req.body.review);
    route.reviews.push(review);
    await review.save();
    await route.save();
    res.redirect(`/routes/${route._id}`);
}))

app.delete('/routes/:id/reviews/:reviewId', catchAsync(async (req,res)=> {
    const {id, reviewId } = req.params;
    await Route.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/routes/${id}`);
}))

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