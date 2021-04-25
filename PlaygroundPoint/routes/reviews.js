const express = require('express');
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require('../schemas.js');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const Playground = require('../models/playground');
const Review = require('../models/review');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    req.flash('success', 'Added review!')
    res.redirect(`/playgrounds/${playground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Playground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!')
    res.redirect(`/playgrounds/${id}`);
}))


module.exports = router;