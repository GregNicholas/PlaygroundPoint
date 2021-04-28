const Playground = require('../models/playground');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');

module.exports.addReview = catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    req.flash('success', 'Added review!')
    res.redirect(`/playgrounds/${playground._id}`);
})

module.exports.destroyReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Playground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!')
    res.redirect(`/playgrounds/${id}`);
})