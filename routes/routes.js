const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Route = require('../models/routes');
const { isLoggedIn, validateRoute, isAuthor } = require('../middleware');


router.get('/', catchAsync(async (req, res,) => {
    const routes = await Route.find({});
    res.render('routes/index', { routes })
}));

router.get('/new', isLoggedIn, (req, res,) => {
    res.render('routes/new');
});

router.post('/', isLoggedIn, validateRoute, catchAsync(async (req, res, next) => {
    const route = new Route(req.body.campground);
    route.author = req.user._id;
    await route.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/routes/${route._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path:'author',
        } 
    }).populate('author');
    if (!route) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/routes');
    }
    res.render('routes/show', { route });
}));

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const route = await Route.findById(id);
    if (!route) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/routes');
    }
    res.render('routes/edit', { route });
}));

router.put('/:id',isLoggedIn,isAuthor, validateRoute, catchAsync(async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndUpdate(id, {... req.body.route});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/routes/${route._id}`)
}));

router.delete('/:id',isLoggedIn,isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Route.findByIdAndDelete(id)
    res.redirect('routes');
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/routes');
}));

module.exports = router;