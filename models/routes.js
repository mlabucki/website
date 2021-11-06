const mongoose = require('mongoose');
const { routeSchema } = require('../schemas');
const Review = require('./review');
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
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

CyclingRoutesSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Route', CyclingRoutesSchema);