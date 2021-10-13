const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CyclingRoutesSchema = new Schema({
    title: String,
    location: String,
    distance: Number,
    type: String,
    description: String,
});

module.exports = mongoose.model('Route', CyclingRoutesSchema);