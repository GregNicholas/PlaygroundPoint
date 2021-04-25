const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { replaceOne } = require('../models/user');

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/playgrounds');
    }
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try{
    const { email, username, password } = req.body
    const user = new User({email, username});
    const newUser = await User.register(user, password);
    req.login(newUser, err => {
        if(err){
            return next(err);
        }
    })
    req.flash('success', 'Welcome to Playground Point!');
    res.redirect('/playgrounds');
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/playgrounds');
    }
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/playgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('playgrounds');
})

module.exports = router;