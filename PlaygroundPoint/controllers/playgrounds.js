const Playground = require('../models/playground');
const catchAsync = require('../utils/catchAsync');

module.exports.index = catchAsync(async (req, res) => {
    const playgrounds = await Playground.find({});
    res.render('playgrounds/index', {playgrounds});
})

module.exports.renderNewForm = (req, res) => {
    res.render('playgrounds/new');
}

module.exports.create = catchAsync(async (req, res, next) => {
    const playground = new Playground(req.body.playground);
    playground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    playground.author = req.user._id;
    await playground.save();
    console.log(playground)
    req.flash('success', 'Successfully added new playground!')
    res.redirect(`/playgrounds/${playground._id}`);
})

module.exports.showPlayground = catchAsync(async (req, res) => {
    const playground = await Playground.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!playground){
        req.flash('error', 'This playground not found!');
        return res.redirect('/playgrounds');
    }
    res.render('playgrounds/show', { playground }); 
})

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findById(id);
    if(!playground){
        req.flash('error', 'This playground not found!');
        return res.redirect('/playgrounds');
    }
    res.render('playgrounds/edit', { playground });
})

module.exports.edit = catchAsync(async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findByIdAndUpdate(id, { ...req.body.playground });
    req.flash('success', 'Successfully updated playground!')
    res.redirect(`/playgrounds/${playground._id}`)
})

module.exports.destroy = catchAsync(async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findById(req.params.id);
    await Playground.findByIdAndDelete(id);
    req.flash('success', `Deleted playground ${playground.title}!`)
    res.redirect(`/playgrounds`);
})