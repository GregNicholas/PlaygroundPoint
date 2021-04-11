const express = require('express');
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require('../schemas.js');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Playground = require('../models/playground');
const Review = require('../models/review');


const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id);
    const review = new Review(req.body.review);
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    req.flash('success', 'Added review!')
    res.redirect(`/playgrounds/${playground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Playground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!')
    res.redirect(`/playgrounds/${id}`);
}))


module.exports = router;