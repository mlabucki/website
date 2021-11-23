const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isAuthor, isReviewAuthor} = require('../middleware');
const Route = require('../models/routes');
const Review = require('../models/review');
const reviews = require('../controlles/reviews');

const catchAsync = require('../utils/catchAsync');


router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;