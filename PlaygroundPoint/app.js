const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { playgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Playground = require('./models/playground');
const Review = require('./models/review');
const playgroundRoutes = require('./routes/playgrounds');

mongoose.connect('mongodb://localhost:27017/playground-point', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/playgrounds', playgroundRoutes)




app.get('/', (req, res) => {
    res.render('home')
});




app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, something went wrong!' 
    res.status(statusCode).render('error', {err});
});


app.listen(3000, () => {
    console.log('Serving on port 3000')
});

