const Route = require('../models/routes');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res,) => {
    const routes = await Route.find({});
    res.render('routes/index', { routes })
}

module.exports.renderNewForm = (req, res,) => {
    res.render('routes/new');
}

module.exports.createRoute = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.route.location,
        limit: 1
    }).send()
    const route = new Route(req.body.route);
    route.geometry = geoData.body.features[0].geometry;
    route.images= req.files.map(f => ({url: f.path, filename: f.filename }));
    route.author = req.user._id;
    await route.save();
    console.log(route);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/routes/${route._id}`)
}

module.exports.showRoute = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const route = await Route.findById(id);
    if (!route) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/routes');
    }
    res.render('routes/edit', { route });
}

module.exports.updateRoute = async (req, res) => {
    const { id } = req.params;
    const route = await Route.findByIdAndUpdate(id, {... req.body.route});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename }));
    route.images.push(...imgs);
    await route.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await route.updateOne({$pull:{images: {filename:{$in: req.body.deleteImages}}}}); 
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/routes/${route._id}`)
}

module.exports.deleteRoute = async (req, res) => {
    const { id } = req.params;
    await Route.findByIdAndDelete(id)
    res.redirect('routes');
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/routes');
}