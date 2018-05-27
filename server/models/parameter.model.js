const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParameterSchema = Schema({
    _id: Schema.Types.ObjectId,
    cropName: String,
    cropSpecie: String,
    cropMoistureLimit: Number,
    cropHumidityLimit: Number,
    cropWateringFrequency: Number,
    cropLifeSpan: Number
});

module.exports = mongoose.model('Parameter',ParameterSchema);