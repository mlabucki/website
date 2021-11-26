const Joi = require('joi');
const {numer} = require('joi');

module.exports.routeSchema = Joi.object({
    route: Joi.object({
        title: Joi.string().required(),
        distance: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        // image: Joi.string().required(),
    }).required(),
    deleteImages:Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body:Joi.string().required(),
    }).required()
})