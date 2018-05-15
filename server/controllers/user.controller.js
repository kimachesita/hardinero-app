const userService = require('../services/user.service');
const _ = require('lodash');

let controller = {};

controller.authenticate = authenticate;
controller.register = register;
controller.getAll = getAll;
controller.getCurrent = getCurrent;
controller.update = update;
controller._delete = _delete;
controller.getById = getById;

module.exports = controller;

function authenticate(req,res){
    userService.authenticate(req.body.username,req.body.password)
    .then(function(user){
        if(user){
            //authentication successful
            res.send(user);
        }else{
            //authentication failed
            res.status(400).send('Username or password is incorrect');
        }
    })
    .catch(function(err){
        res.status(400).send(err);
    })
}

function register(req,res){
    userService.create(req.body)
    .then(function(){
      res.json('sucess');
    })
    .catch(function(err){
      res.status(400).send(err);
    });
}

function getAll(req,res){
  userService.getAll()
  .then(function(users){
      res.send(users);
  })
  .catch(function(err){
      res.status(400).send(err);
  });
}

function getCurrent(req,res){
  userService.getById(req.user.sub)
    .then(function(user){
        if(user){
            res.send(user);
        }else{
            res.sendStatus(404);
        }
    })
    .catch(function(err){
        res.status(400).send(err);
    });
}

function update(req,res){
  userService.update(req.params._id,req.body)
    .then(function(){
        res.json('sucess');
    })
    .catch(function(err){
      res.status(400).send(err);
    })
}

function _delete(req,res){
  userService.delete(req.params._id)
    .then(function(){
        res.json('success');
    })
    .catch(function(err){
        res.status(400).send(err);
    });
}

function getById(req,res){
    userService.getById(req.params._id)
     .then(function(user){
         if(user){
             res.send(user);
         }else{
             res.sendStatus(404);
         }
     })
     .catch(function(err){
         res.status(400).send(err);
     })
}