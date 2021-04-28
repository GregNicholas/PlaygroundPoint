const mongoose = require('mongoose');
const Playground = require('../models/playground');
const Review = require('../models/review');
const {descriptors, places} = require('./seedHelpers');
const cities = require('./cities');

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

const chooseRandom = array => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Playground.deleteMany({});
    await Review.deleteMany({});
    for(let i=0; i<50; i++){
        const randLocation = chooseRandom(cities);
        const random = (Math.floor(Math.random()*3) + 1);
        let iceCream = '';
        if(random === 1) {
            iceCream = "Ice Cream Trucks at least once per day"
        } else if(random === 2) {
            iceCream = "Ice Cream Truck once per day or less"
        } else {
            iceCream = "Infrequent or no Ice Cream Trucks"
        }
        const pGround = new Playground({
            author: '607b342fc10efa1a270770c4',
            title: `${chooseRandom(descriptors)} ${chooseRandom(places)}`,
            iceCreamTruck: iceCream,
            restrooms: 'Yes',
            parkingSpots: 42,
            location: `${randLocation.city}, ${randLocation.state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/mobyd/image/upload/v1619589360/PlaygroundPoint/zoty0ouib3qhkj3uh4pe.jpg',
                  filename: 'PlaygroundPoint/zoty0ouib3qhkj3uh4pe'
                },
                {
                  url: 'https://res.cloudinary.com/mobyd/image/upload/v1619589360/PlaygroundPoint/l5xj9onfwlaneimqylog.jpg',
                  filename: 'PlaygroundPoint/l5xj9onfwlaneimqylog'
                }
              ],
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore quidem temporibus reprehenderit! Dolores, consequatur ipsum, eos, eum velit perspiciatis harum necessitatibus dolorum eaque totam reprehenderit delectus impedit laudantium facilis sunt.'
        });
        await pGround.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})