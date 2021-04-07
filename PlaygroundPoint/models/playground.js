const mongoose = require('mongoose');
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

module.exports = mongoose.model('Playground', PlaygroundSchema);
