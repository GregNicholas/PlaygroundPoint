const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

module.exports.renderRegisterForm = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/playgrounds');
    }
    res.render('users/register');
}

module.exports.registerUser = catchAsync(async (req, res, next) => {
    try{
    const { email, username, password } = req.body
    const user = new User({email, username});
    if(req.body.adminCode === "SandyIsAJoy!") {
        user.isAdmin = true;
    }
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
})

module.exports.renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/playgrounds');
    }
    res.render('users/login');
}

module.exports.loginUser = (req, res) =>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/playgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('playgrounds');
}
