const express = require('express');
const router = express.Router();
const routes = require('../controlles/routes')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateRoute, isAuthor } = require('../middleware');

const Route = require('../models/routes');
router.route('/')
    .get( catchAsync(routes.index))
    .post(isLoggedIn, validateRoute, catchAsync(routes.createRoute))

router.get('/new', isLoggedIn, routes.renderNewForm)

router.route('/:id')
    .get(catchAsync(routes.showRoute))
    .put(isLoggedIn,isAuthor, validateRoute, catchAsync(routes.updateRoute)) 
    .delete(isLoggedIn,isAuthor, catchAsync(routes.deleteRoute)) 

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(routes.renderEditForm))

module.exports = router;