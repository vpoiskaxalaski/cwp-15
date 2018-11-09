const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db');

const geolib = require('geolib');
const valid = require("./valid").valid;

router.use(bodyParser.json());

router.get('/readall', (req, resp) => {
	if (!req.manager.super) {
		db.Vehicle.findAll({
			where: {
				fleetId: req.manager.fleetId,
				deletedAt: null
			}
		}).then((result) => {
			console.log(result);
			if (result.length < 1 || result.deletedAt === null) {
				console.log("404");
				resp.statusCode = 404;
				resp.json({error: "404 - not found"});
			}
			else {
				resp.json(result);
			}
		});
	}
	else
	{
		db.Vehicle.findAll({
			where: {
				deletedAt: null
			}
		}).then((result) => {
			console.log(result);
			if (result.length < 1 || result.deletedAt === null) {
				console.log("404");
				resp.statusCode = 404;
				resp.json({error: "404 - not found"});
			}
			else {
				resp.json(result);
			}
		});
	}
});

router.get('/read/:id', (req, resp) => {
	let err = valid(req);
	if (err === "")
	{
		db.Vehicle.findByPk(req.params.id).then((result) => {
			if (result === null || result.deletedAt !== null) {
				console.log("404");
				resp.statusCode = 404;
				resp.json({error: "404 - not found"});
			}
			else {
				if (req.manager.super || result.fleetId === req.manager.fleetId) {
					resp.json(result);
				}
				else
				{
					resp.json({"error": "Sorry, you don't have access"})
				}
			}
		});
	}
	else
	{
		resp.json({ 'error': err });
	}
});

router.post('/create', (req, resp) => {
	let fleetId = req.manager.fleetId;
	if (req.manager.super)
	{
		let err = valid(req);
		if (err === "") {
			fleetId = req.body.fleetId;
		}
		else
		{
			resp.json({ 'error': err });
		}
	}
	db.Fleet.findByPk(fleetId).then((result) => {
		if (result === null || result.deletedAt !== null)
		{
			console.log("404");
			resp.statusCode = 404;
			resp.json({error: "404 - not found"});
		}
		else
		{
			db.Vehicle.create({
				'name': req.body.name,
				'fleetId': fleetId
			}).then((result) => {
				resp.json(result);
			});
		}
	});
});

router.post('/update', (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		db.Vehicle.findByPk(req.body.id).then((vehicle) =>
		{
			if (vehicle === null || vehicle.deletedAt !== null)
			{
				console.log("404");
				res.statusCode = 404;
				res.json({error: "404 - not found"});
			}
			else
			{
				if (req.manager.super || vehicle.fleetId === req.manager.fleetId)
				{
					db.Vehicle.update(
						{
							name: req.body.name,
							fleetId: req.body.fleetId
						},
						{
							where: {
								id: req.body.id,
								deletedAt: null
							}
						}
					).then((result) => {
						if (!result)
						{
							console.log("400");
							res.statusCode = 400;
							res.json({error: "400 - bad request"});
						}
						else
						{
							db.Vehicle.findByPk(req.body.id).then((vehicle) => {
								res.json(vehicle);
							});
						}
					});
				}
				else
				{
					res.json({"error": "Sorry, you don't have access"})
				}
			}
		});
	}
	else
	{
		resp.json({ 'error': err });
	}
});

router.post('/delete', (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		db.Vehicle.findByPk(req.body.id).then((vehicle) =>
		{
			if (vehicle === null || vehicle.deletedAt !== null)
			{
				console.log("404");
				res.statusCode = 404;
				res.json({error: "404 - not found"});
			}
			else {
				if (req.manager.super || vehicle.fleetId === req.manager.fleetId)
				{
					db.Fleet.destroy({
						where: {
							id: req.body.id,
							deletedAt: null
						}
					}).then((result) => {
						res.json(result ? "deleted" : "error deleting");
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

router.get('/milage/:vehicleId', (req, resp) => {
	let err = valid(req);
	if (err === "")
	{
		db.Vehicle.findByPk(req.params.vehicleId).then((vehicle) => {
			if (vehicle === null || vehicle.deletedAt !== null) {
				console.log("404");
				res.statusCode = 404;
				res.json({error: "404 - not found"});
			}
			else {
				if (req.manager.super || vehicle.fleetId === req.manager.fleetId)
				{
					let coords = [];
					let coordstime = [];
					db.Motion.findAll({
						where: {
							vehicleId: req.params.id
						}
					}).then((result) => {
						result.forEach((motion) => {
							coords.push(motion.latLng);
							coordstime.push(motion.latLngTime);
						});

						let len = 0;
						let spd = 0;
						if (coords.length < 2) {
							resp.json(len);
						}
						for (var i = 0; i < coords.length - 1; i++) {
							len += geolib.getDistanceSimple(coords[i], coords[i + 1]);
							console.log(geolib.getDistanceSimple(coords[i], coords[i + 1]));
							spd += geolib.getSpeed(coordstime[i], coordstime[i + 1]);
							console.log(geolib.getSpeed(coordstime[i], coordstime[i + 1]));
						}

						resp.json({
							'getDistance': len,
							'getPathLength': (coords.length < 2) ? 0 : geolib.getPathLength(coords),
							'getAvgSpeed': Math.round(spd / (coordstime.length - 1))
						});
					});
				}
				else
				{
					res.json({"error": "Sorry, you don't have access"})
				}
			}
		});
	}
	else
	{
		resp.json({ 'error': err });
	}
});


module.exports = router;