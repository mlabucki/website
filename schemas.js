const Joi = require('joi');

module.exports.routeSchema = Joi.object({
    route: Joi.object({
        title: Joi.string().required(),
        distance: Joi.number().required().min(0),
        location: Joi.string().required,
        description: Joi.string().required,
        image: Joi.string().required,
    }).required()
});