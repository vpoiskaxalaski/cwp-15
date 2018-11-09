const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db');
const valid = require("./valid").valid;

router.use(bodyParser.json());

router.post('/create', (req, res) => {
	let err = valid(req);
	if (err === "") {
		db.Vehicle.findByPk(req.body.vehicleId).then((vehicle) => {
			if (vehicle === null || vehicle.deletedAt !== null) {
				console.log("404");
				res.statusCode = 404;
				res.json({error: "404 - not found"});
			}
			else {
				if (req.manager.super || vehicle.fleetId === req.manager.fleetId) {
					db.Motion.create({
						latitude: req.body.latitude,
						longitude: req.body.longitude,
						time: req.body.time,
						vehicleId: req.body.vehicleId
					}).then((result) => {
						res.json(result);
					});
				}

				else {
					res.json({"error": "Sorry, you don't have access"})
				}
			}
		});
	}
	else
	{
		res.json({ 'error': err });
	}
});

module.exports = router;