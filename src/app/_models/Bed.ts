export class Bed{
    _id: string;
    bedCommonName: string;
    bedLocation: string;
    bedOwner: string;
    bedIPCamURI: string;
    bedCrop:{
        cropName: string;
        cropSpecie: string;
        cropPlantDate: Date;
        cropHarvestDate: Date;
        cropMoistureLimit: Number;
        cropHumidityLimit: Number;
        cropWateringFrequency: Number;
    };
    bedReading: {
        weather: string;
        temperature: Number;
        humidity: Number;
        waterMoisture1: Number;
        waterMoisture2: Number;
        waterPumpOn: Boolean;
        tankLevel: Number;
        lastWatering: string
    };
    bedMonitoringDevKey: string;
    bedMonitoringDevActive: boolean;
}
