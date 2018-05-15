const config = require('../config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongoose = require('mongoose');

const Bed = require('../models/bed.model');

let service = {};


service.register = register;
service.getAll = getAll;
service.getById = getById;
service.update = update;
service._delete = _delete;

module.exports = service;

function register(bedParam, ownerId){

    let deferred = Q.defer();

     // validation
    // validate bedCommonName - make sure unique in the user scope
    // validate bedMonitoringDevKey - make sure unique
    if(bedParam.bedMonitoringDevKey){
        Bed.findOne({bedMonitoringDevKey: bedParam.bedMonitoringDevKey},
            function(err,bed){
                if(err) deferred.reject(err.name + ':' + err.message );
                if(bed){
                    deferred.reject('Monitoring Device "' + bedParam.bedMonitoringDevKey + '" already taken! ');
                }else{
                    if(bedParam.bedCommonName){
                        Bed.findOne({bedCommonName: bedParam.bedCommonName, bedOwner: ownerId},
                            function(err,bed){
                                if(err) deferred.reject(err.name + ':' + err.message );
                                if(bed){
                                    deferred.reject('Bed Common Name "' + bedParam.bedCommonName + '" exist already! ');
                                }else{
                                    _createBed();
                                }
                            }
                        );
                    }
                }          
            }
        );
    }else{
        if(bedParam.bedCommonName){
            Bed.findOne({bedCommonName: bedParam.bedCommonName, bedOwner: ownerId},
                function(err,bed){
                    if(err) deferred.reject(err.name + ':' + err.message );
                    if(bed){
                        deferred.reject('Bed Common Name "' + bedParam.bedCommonName + '" exist already! ');
                    }else{
                        _createBed();
                    }
                }
            );
        }else{
            _createBed();
        }
    }

    function _createBed(){
        //create bed model
        let bed = Bed();

        //set user object to userParam without the cleartext password
        bed._id = new mongoose.Types.ObjectId;
        bed.bedCommonName = bedParam.bedCommonName;
        bed.bedLocation = bedParam.bedLocation;
        bed.bedOwner = ownerId;
        bed.bedIPCamURI = bedParam.bedIPCamURI;
        bed.bedMonitoringDevKey = bedParam.bedMonitoringDevKey;

        bed.save(function(err){
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function getAll(ownerId) {
    let deferred = Q.defer();
 
    Bed.find({bedOwner: ownerId},function (err, beds) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(beds);
    });
 
    return deferred.promise;
}

function getById(id) {
    
    let deferred = Q.defer();
    Bed.findById(id, function (err, bed) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (bed) {
            deferred.resolve(bed);
        } else {
            // bed not found
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}

function update(_id, bedParam, ownerId) {

    let deferred = Q.defer();
    let proceed = true;
    let currentBed = {};
    let validatorSwitch = [0 , 0];
 
    // validation
    // validate bedCommonName - make sure unique in the user scope
    // validate bedMonitoringDevKey - make sure unique
    Bed.findById(_id,(err,bed)=>{
        if(err) deferred.reject(err.name + ':' + err.message );
        if(bed){
            currentBed = bed;
            _validate();
        }
    });
    
    function _validate(){
        if(bedParam.bedCommonName == "") bedParam.bedCommonName = currentBed.bedCommonName;
        if(bedParam.bedMonitoringDevKey == "") bedParam.bedMonitoringDevKey = currentBed.bedMonitoringDevKey;
        if(bedParam.bedCommonName != currentBed.bedCommonName) validatorSwitch[0] = 1;
        if(bedParam.bedMonitoringDevKey != currentBed.bedMonitoringDevKey) validatorSwitch[1] = 1;
        if(validatorSwitch[0] == 0 && validatorSwitch[1] == 0){
            //nothing is changed, update anyway
            _updateBed();
        }else if(validatorSwitch[0] == 1 && validatorSwitch[1] == 0){
            Bed.findOne({bedCommonName: bedParam.bedCommonName,bedOwner: ownerId},(err,bed)=>{
                if(err) deferred.reject(err.name + ':' + err.message );
                if(bed){
                    deferred.reject('Bed Common Name "' + bedParam.bedCommonName + '" exist already! ');
                }else{
                    _updateBed();
                }
            });
        }else if(validatorSwitch[0] == 0 && validatorSwitch[1] == 1){
            Bed.findOne({bedMonitoringDevKey: bedParam.bedMonitoringDevKey},(err,bed)=>{
                if(err) deferred.reject(err.name + ':' + err.message );
                if(bed){
                    deferred.reject('Bed Monitoring Device "' + bedParam.bedMonitoringDevKey + '" exist already! ');
                }else{
                    _updateBed();
                }
            });
        }else if(validatorSwitch[0] == 1 && validatorSwitch[1] == 1){
            Bed.findOne({bedCommonName: bedParam.bedCommonName,bedOwner: ownerId},(err,bed)=>{
                if(err) deferred.reject(err.name + ':' + err.message );
                if(bed){
                    deferred.reject('Bed Common Name "' + bedParam.bedCommonName + '" exist already! ');
                }else{
                    Bed.findOne({bedMonitoringDevKey: bedParam.bedMonitoringDevKey},(err,bed)=>{
                        if(err) deferred.reject(err.name + ':' + err.message );
                        if(bed){
                            deferred.reject('Bed Monitoring Device "' + bedParam.bedMonitoringDevKey + '" exist already! ');
                        }else{
                            _updateBed();
                        }
                    });
                }
            });
        }
    }

    function _updateBed() {
        if(bedParam.bedCommonName) currentBed.bedCommonName = bedParam.bedCommonName;
        if(bedParam.bedLocation) currentBed.bedLocation = bedParam.bedLocation;
        if(bedParam.bedIPCamURI) currentBed.bedIPCamURI = bedParam.bedIPCamURI;
        if(bedParam.bedCrop && bedParam.bedCrop.cropName) currentBed.bedCrop.cropName = bedParam.bedCrop.cropName;
        if(bedParam.bedCrop && bedParam.bedCrop.cropSpecie) currentBed.bedCrop.cropSpecie = bedParam.bedCrop.cropSpecie;
        if(bedParam.bedCrop && bedParam.bedCrop.cropPlantDate) currentBed.bedCrop.cropPlantDate = bedParam.bedCrop.cropPlantDate;
        if(bedParam.bedCrop && bedParam.bedCrop.cropHarvestDate) currentBed.bedCrop.cropHarvestDate = bedParam.bedCrop.cropHarvestDate;
        if(bedParam.bedCrop && bedParam.bedCrop.cropMoistureLimit) currentBed.bedCrop.cropMoistureLimit = bedParam.bedCrop.cropMoistureLimit;
        if(bedParam.bedCrop && bedParam.bedCrop.cropHumidityLimit) currentBed.bedCrop.cropHumidityLimit = bedParam.bedCrop.cropHumidityLimit;
        if(bedParam.bedCrop && bedParam.bedCrop.cropWateringFrequency) currentBed.bedCrop.cropWateringFrequency = bedParam.bedCrop.cropWateringFrequency;
        if(bedParam.bedMonitoringDevKey) currentBed.bedMonitoringDevKey = bedParam.bedMonitoringDevKey;
        if(bedParam.bedMonitoringDevActive) currentBed.bedMonitoringDevActive = bedParam.bedMonitoringDevActive;
        
        currentBed.save(function(err){
            if (err) deferred.reject(err.name + ': ' + err.message);
                deferred.resolve();
        });
        
    }
 
    return deferred.promise;
}
 
function _delete(id) {

    let deferred = Q.defer();
 
    Bed.remove(
        { _id: id },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}
