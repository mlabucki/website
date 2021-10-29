const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CyclingRoutesSchema = new Schema({
    title: String,
    image:String,
    location: String,
    distance: Number,
    type: String,
    description: String,
    reviews: [
        {
            typse:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

module.exports = mongoose.model('Route', CyclingRoutesSchema);