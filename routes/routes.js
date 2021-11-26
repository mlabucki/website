const express = require('express');
const router = express.Router();
const routes = require('../controlles/routes')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateRoute, isAuthor } = require('../middleware');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

const Route = require('../models/routes');

router.route('/')
    .get( catchAsync(routes.index))
    .post(isLoggedIn, upload.array('image'),validateRoute, catchAsync(routes.createRoute))
    // .post(upload.array('image'),(req,res)=> {
    //     console.log(req.body, req.files );
    //     res.send('Ju hu');
    // })

router.get('/new', isLoggedIn, routes.renderNewForm)

router.route('/:id')
    .get(catchAsync(routes.showRoute))
    .put(isLoggedIn,isAuthor, upload.array('image'), validateRoute, catchAsync(routes.updateRoute)) 
    .delete(isLoggedIn,isAuthor, catchAsync(routes.deleteRoute)) 

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(routes.renderEditForm))

module.exports = router; 