const bedService = require('../services/bed.service');
const _ = require('lodash');

let controller = {};

controller.register = register;
controller.getAll = getAll;
controller.getById = getById;
controller.update = update;
controller.harvest = harvest;
controller._delete = _delete;
controller.upload = upload;

module.exports = controller;

function register(req, res) {
    bedService.register(req.body, req.user.sub)
        .then(function () {
            res.json('sucess');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    bedService.getAll(req.user.sub)
        .then(function (beds) {
            res.send(beds);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getById(req, res) {
    bedService.getById(req.params._id)
        .then(function (bed) {
            if (bed) {
                res.send(bed);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}

function update(req, res) {
    bedService.update(req.params._id, req.body, req.user.sub)
        .then(function () {
            res.json('sucess');
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}

function harvest(req, res) {
    bedService.harvest(req.params._id, req.body, req.user.sub)
        .then(function () {
            res.json('sucess');
        })
        .catch(function (err) {
            res.status(400).send(err);
        })
}

function _delete(req, res) {
    bedService._delete(req.params._id)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function upload(req,res){
    bedService.upload(req)
    .then(function(){
        res.json('success');
    })
    .catch(function(err){
        res.status(400).send(err);
    })
}