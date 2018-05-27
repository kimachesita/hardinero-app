const config = require('../config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongoose = require('mongoose');

const Parameter = require('../models/parameter.model');

let service = {};

service.add = add;
service.getAll = getAll;
service.getById = getById;
service.getByName = getByName;
service._delete = _delete;

module.exports = service;

function add(param){

    let deferred = Q.defer();

    // validation
    // validate 

    if(param.cropName){
        Parameter.findOne({cropName: param.cropName},
            function(err,parameter){
                if(err) deferred.reject(err.name + ':' + err.message );
                if(parameter){
                    deferred.reject('Crop Name"' + param.cropName + '" already taken! ');
                }else{
                    _createParam();
                }          
            }
        );
    }

    function _createParam(){
        //create param model
        let parameter = Parameter();

        //set user object to userParam without the cleartext password
        parameter._id = new mongoose.Types.ObjectId;
        parameter.cropName = param.cropName;
        parameter.cropSpecie = param.cropSpecie;
        parameter.cropMoistureLimit = param.cropMoistureLimit;
        parameter.cropHumidityLimit = param.cropHumidityLimit;
        parameter.cropWateringFrequency = param.cropWateringFrequency;
        parameter.cropLifeSpan = param.cropLifeSpan;

        parameter.save(function(err){
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function getAll() {
    let deferred = Q.defer();
 
    Parameter.find({},function (err, parameters) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(parameters);
    });
 
    return deferred.promise;
}

function getById(id) {
    
    let deferred = Q.defer();
    Parameter.findById(id, function (err, parameter) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (parameter) {
            deferred.resolve(parameter);
        } else {
            // parameter not found
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}

function getByName(name) {
    
    let deferred = Q.defer();
    Parameter.findOne({cropName: name}, function (err, parameter) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (parameter) {
            deferred.resolve(parameter);
        } else {
            // parameter not found
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}
 
function _delete(id) {

    let deferred = Q.defer();
 
    Parameter.remove(
        { _id: id },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}
