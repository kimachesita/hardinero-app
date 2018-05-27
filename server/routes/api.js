const express = require('express');
const router = express.Router();

let userController = require('../controllers/user.controller');
let bedController = require('../controllers/bed.controller');
let parameterController = require('../controllers/parameter.controller');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

/* User api listing */
router.post('/users/authenticate', userController.authenticate);
router.post('/users/register', userController.register);
router.get('/users/', userController.getAll);
router.get('/users/current', userController.getCurrent);
router.put('/users/:_id', userController.update);
router.delete('/users/:_id', userController._delete);
router.get('/users/:_id',userController.getById);

/* Bed api listing */
router.post('/beds/register',bedController.register);
router.get('/beds',bedController.getAll);
router.get('/beds/:_id',bedController.getById);
router.put('/beds/:_id',bedController.update);
router.put('/beds/harvest/:_id',bedController.harvest);
router.delete('/beds/:_id', bedController._delete);

/* Crop parameters api listing */
router.get('/parameters',parameterController.getAll);
router.get('/parameters/:_id',parameterController.getById);
router.get('/parameters/:name',parameterController.getByName);
router.post('/parameters/add',parameterController.add);
router.delete('/parameters/:_id',parameterController._delete);
module.exports = router;

