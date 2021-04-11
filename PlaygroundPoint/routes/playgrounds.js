const express = require('express');
const router = express.Router();
// const path = require('path');
// const mongoose = require('mongoose');
// const ejsMate = require('ejs-mate');
const { playgroundSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
// const methodOverride = require('method-override');
const Playground = require('../models/playground');
// const Review = require('../models/review');

const validatePlayground = (req, res, next) => {
    const {error} = playgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const playgrounds = await Playground.find({});
    res.render('playgrounds/index', {playgrounds});
}));

router.get('/new', (req, res) => {
    res.render('playgrounds/new');
});

router.post('/', validatePlayground, catchAsync(async (req, res, next) => {
        //if(!req.body.playground) throw new ExpressError('Invalid Playground Data', 400);
        const playground = new Playground(req.body.playground);
        await playground.save();
        req.flash('success', 'Successfully added new playground!')
        res.redirect(`/playgrounds/${playground._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id).populate('reviews');
    if(!playground){
        req.flash('error', 'This playground not found!');
        return res.redirect('/playgrounds');
    }
    res.render('playgrounds/show', { playground }); 
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id);
    if(!playground){
        req.flash('error', 'This playground not found!');
        return res.redirect('/playgrounds');
    }
    res.render('playgrounds/edit', { playground });
}));

router.put('/:id', validatePlayground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findByIdAndUpdate(id, { ...req.body.playground });
    req.flash('success', 'Successfully updated playground!')
    res.redirect(`/playgrounds/${playground._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findById(req.params.id);
    await Playground.findByIdAndDelete(id);
    req.flash('success', `Deleted playground ${playground.title}!`)
    res.redirect(`/playgrounds`);
}));



module.exports = router;