const express = require('express');
const router = express.Router();
const routes = require('../controlles/routes')
const catchAsync = require('../utils/catchAsync');
const Route = require('../models/routes');
const { isLoggedIn, validateRoute, isAuthor } = require('../middleware');


router.get('/', catchAsync(routes.index))

router.get('/new', isLoggedIn, routes.renderNewForm)

router.post('/', isLoggedIn, validateRoute, catchAsync(routes.createRoute))

router.get('/:id', catchAsync(routes.showRoute))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(routes.renderEditForm))

router.put('/:id',isLoggedIn,isAuthor, validateRoute, catchAsync(routes.updateRoute)) 

router.delete('/:id',isLoggedIn,isAuthor, catchAsync(routes.deleteRoute));

module.exports = router;