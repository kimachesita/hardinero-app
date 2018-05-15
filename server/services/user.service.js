const config = require('../config.json');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongoose = require('mongoose');

const User = require('../models/user.model');

let service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function authenticate(username, password) {
    
    let deferred = Q.defer();
 
    User.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
 
        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({
                _id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}

function getAll() {
    let deferred = Q.defer();
 
    User.find({},function (err, users) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        // return users (without hashed passwords)
        users = _.map(users, function (user) {
            return _.omit(user,'hash');
        });
 
        deferred.resolve(users);
    });
 
    return deferred.promise;
}

function getById(_id) {
    
    let deferred = Q.defer();
 
    User.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
            //deferred.resolve(user);
        } else {
            // user not found
            deferred.resolve();
        }
    });
 
    return deferred.promise;
}

function create(userParam){

    let deferred = Q.defer();
   
    // validation
    User.findOne({ username: userParam.username},
        function(err,user){
            if(err) deferred.reject(err.name + ':' + err.message );
            if(user){
                //username already exist
                deferred.reject('Username "' + userParam.username + '" exist already! ');
            } else {
                createUser();
            }
        }
    );

    function createUser(){
        //create user model
        let user = User();

        //set user object to userParam without the cleartext password
        user._id = new mongoose.Types.ObjectId;
        user.username = userParam.username;
        user.firstName = userParam.firstName;
        user.lastName = userParam.lastName;

        //add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password,10);
        user.save(function(err){
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }

    return deferred.promise;
}

function update(_id, userParam) {

    let deferred = Q.defer();
 
    // validation
    User.findById(_id, function (err, user) {
        
        if (err) deferred.reject(err.name + ': ' + err.message);
 
        if(userParam.username){
            User.findOne({username: userParam.username},
                function(err,hit){
                    if(err) deferred.reject(err.name + ': ' + err.message);
                    if(hit){
                        //username already exist
                        deferred.reject('Username "' + req.body.username + '" is already taken');
                    }else{
                        updateUser(user);
                    }
                });
        }else{
            //userParam.username not given ., update anyway
            updateUser(user);
        }   
    });
 
    function updateUser(user) {
        // fields to update
        //update username if given
        if(userParam.username){
            user.username = userParam.username;
        }
        user.firstName = userParam.firstname;
        user.lastName = userParam.lastname;
        
 
        // update password if it was entered
        if (userParam.password) {
            user.hash = bcrypt.hashSync(userParam.password, 10);
        }
 
        user.save(function(err){
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    }
 
    return deferred.promise;
}
 
function _delete(id) {

    let deferred = Q.defer();
 
    User.remove(
        { _id: id },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
 
            deferred.resolve();
        });
 
    return deferred.promise;
}
