const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isAuthor, isReviewAuthor} = require('../middleware');
const Route = require('../models/routes');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');


router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const route = await Route.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;  
    route.reviews.push(review);
    await review.save();
    await route.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/routes/${route._id}`);
}))

router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Route.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;