const express = require('express');
const router = express.Router();
const fleetsRouter = require('./handlers/fleets');
const vehiclesRouter = require('./handlers/vehicles');
const motionsRouter = require('./handlers/motions');
const authRouter = require('./handlers/auth');

router.use('/fleets', fleetsRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/motions', motionsRouter);
router.use('/auth', authRouter);

module.exports = router;