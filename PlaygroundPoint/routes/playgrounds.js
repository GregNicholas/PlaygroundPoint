const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { playgroundSchema, reviewSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const methodOverride = require('method-override');
const Playground = require('../models/playground');
const Review = require('../models/review');


const validatePlayground = (req, res, next) => {
    const {error} = playgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/playgrounds', catchAsync(async (req, res) => {
    const playgrounds = await Playground.find({});
    res.render('playgrounds/index', {playgrounds});
}));

router.get('/playgrounds/new', (req, res) => {
    res.render('playgrounds/new');
});

router.post('/playgrounds', validatePlayground, catchAsync(async (req, res, next) => {
        //if(!req.body.playground) throw new ExpressError('Invalid Playground Data', 400);
        const playground = new Playground(req.body.playground);
        await playground.save();
        res.redirect(`/playgrounds/${playground._id}`);
}));

router.get('/playgrounds/:id', catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id).populate('reviews');
    res.render('playgrounds/show', { playground });
}));

router.get('/playgrounds/:id/edit', catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id);
    res.render('playgrounds/edit', { playground });
}));

router.put('/playgrounds/:id', validatePlayground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findByIdAndUpdate(id, { ...req.body.playground });
    res.redirect(`/playgrounds/${playground._id}`)
}));

router.delete('/playgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Playground.findByIdAndDelete(id);
    res.redirect(`/playgrounds`);
}));

router.post('/playgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id);
    const review = new Review(req.body.review);
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    res.redirect(`/playgrounds/${playground._id}`);
}));

router.delete('/playgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Playground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/playgrounds/${id}`);
}))

// router.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// });



module.exports = router;