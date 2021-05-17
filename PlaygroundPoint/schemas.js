const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value})
                return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension);


const playgroundSchema = Joi.object({
    playground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        parkingSpots: Joi.number().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        restrooms: Joi.string().required().escapeHTML(),
        iceCreamTruck: Joi.string().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required().escapeHTML(),
    }).required()
});

module.exports = { playgroundSchema, reviewSchema }