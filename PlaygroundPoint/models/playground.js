const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const PlaygroundSchema = new Schema({
    title: String,
    image: String,
    iceCreamTruck: String,
    restrooms: String,
    description: String,
    location: String,
    parkingSpots: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
});

PlaygroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Playground', PlaygroundSchema);
