const Joi = require('joi');

const playgroundSchema = Joi.object({
    playground: Joi.object({
        title: Joi.string().required(),
        parkingSpots: Joi.number().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        restrooms: Joi.string().required(),
        iceCreamTruck: Joi.string(),
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required(),
    }).required()
});

module.exports = { playgroundSchema, reviewSchema }