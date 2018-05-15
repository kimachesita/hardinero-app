const parameterService = require('../services/parameter.service');
const _ = require('lodash');

let controller = {};

controller.add = add;
controller.getAll = getAll;
controller.getById = getById;
controller.getByName = getByName;
controller._delete = _delete;

module.exports = controller;

function add(req,res){
    parameterService.add(req.body)
    .then(function(){
      res.json('sucess');
    })
    .catch(function(err){
      res.status(400).send(err);
    });
}

function getAll(req,res){
    parameterService.getAll()
    .then(function(parameters){
        res.send(parameters);
    })
    .catch(function(err){
        res.status(400).send(err);
    });
}

function getById(req,res){
    parameterService.getById(req.params._id)
     .then(function(parameter){
         if(parameter){
             res.send(parameter);
         }else{
             res.sendStatus(404);
         }
     })
     .catch(function(err){
         res.status(400).send(err);
     })
}

function getByName(req,res){
    parameterService.getById(req.params.name)
     .then(function(parameter){
         if(parameter){
             res.send(parameter);
         }else{
             res.sendStatus(404);
         }
     })
     .catch(function(err){
         res.status(400).send(err);
     })
}

function _delete(req,res){
    parameterService._delete(req.params._id)
      .then(function(){
          res.json('success');
      })
      .catch(function(err){
          res.status(400).send(err);
      });
}