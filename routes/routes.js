const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {routeSchema} = require('../schemas');

const ExpressError = require('../utils/ExpressError');
const Route = require('../models/routes');

const validateRoute = (req,res,next) => {
    const { error } = routeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res,) => {
    const routes = await Route.find({});
    res.render('routes/index', { routes })
}));

router.get('/new', (req, res,) => {
    res.render('routes/new');
});

router.post('/', validateRoute, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const route = new Route(req.body.campground);
    await route.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/routes/${route._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id).populate('reviews');
    if (!route) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/routes');
    }
    res.render('routes/show', { route });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id)
    if (!route) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/routes');
    }
    res.render('routes/edit', { route });
}));

router.put('/:id', validateRoute, catchAsync(async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndUpdate(id, { ...req.body.route }) //spread object
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/routes/${route._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Route.findByIdAndDelete(id)
    res.redirect('routes');
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/routes');
}));

module.exports = router;