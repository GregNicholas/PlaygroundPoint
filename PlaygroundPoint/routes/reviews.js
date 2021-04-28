const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas.js');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const reviews = require('../controllers/reviews')
const Playground = require('../models/playground');
const Review = require('../models/review');

router.post('/', isLoggedIn, validateReview, reviews.addReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.destroyReview)


module.exports = router;