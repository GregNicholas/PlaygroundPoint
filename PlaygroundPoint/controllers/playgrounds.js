const Playground = require('../models/playground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require('../cloudinary');

module.exports.index = catchAsync(async (req, res) => {
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all playgrounds from DB
        await Playground.find({title: regex}, function(err, allPlaygrounds){
           if(err){
               console.log(err);
           } else {
              if(allPlaygrounds.length < 1) {
                  req.flash("error", "Playground not found");
                  return res.redirect("playgrounds");
              }
              res.render("playgrounds/index",{playgrounds:allPlaygrounds});
           }
        });
    } else {
        // Get all playgrounds from DB
        Playground.find({}, function(err, allPlaygrounds){
           if(err){
               console.log(err);
           } else {
              res.render("playgrounds/index",{playgrounds:allPlaygrounds});
           }
        });
    }
});

module.exports.renderNewForm = (req, res) => {
    res.render('playgrounds/new');
}

module.exports.create = catchAsync(async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.playground.location,
        limit: 1,
    }).send();
    const playground = new Playground(req.body.playground);
    playground.geometry = geoData.body.features[0].geometry;
    playground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    playground.author = req.user._id;
    await playground.save();
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    playground.images.push(...imgs);
    await playground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await playground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated playground!')
    res.redirect(`/playgrounds/${playground._id}`)
})

module.exports.destroy = catchAsync(async (req, res) => {
    const { id } = req.params;
    const playground = await Playground.findByIdAndDelete(id);
    for (let image of playground.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    req.flash('success', `Deleted playground ${playground.title}!`)
    res.redirect(`/playgrounds`);
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
