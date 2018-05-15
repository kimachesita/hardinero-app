const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BedSchema = Schema({
    _id: Schema.Types.ObjectId,
    bedCommonName: String,
    bedLocation: String,
    bedOwner: String,
    bedIPCamURI: String,
    bedCrop:{
        cropName: String,
        cropSpecie: String,
        cropPlantDate: Date,
        cropHarvestDate: Date,
        cropMoistureLimit: Number,
        cropHumidityLimit: Number,
        cropWateringFrequency: Number
    },
    bedReading: {
        weather: String,
        temperature: Number,
        humidity: Number,
        waterMoisture1: Number,
        waterMoisture2: Number,
        waterPumpOn: Boolean,
        tankLevel: Number,
        lastWatering: String
    },
    bedMonitoringDevKey: String,
    bedMonitoringDevActive: Boolean
});

module.exports = mongoose.model('Bed',BedSchema);