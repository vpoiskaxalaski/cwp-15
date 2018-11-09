const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db');
const valid = require("./valid").valid;

router.use(bodyParser.json());

router.get('/readall', (req, res) => {
	if (req.manager.super) {
		db.Fleet.findAll().then((result) => {
			res.json(result);
		});
	}
	else
	{
		res.status(403).end("You are not supermanager");
	}
});

router.get('/read/:id', (req, res) => {
	if (!req.manager.super)
	{
		req.params.id = req.manager.fleetId;
	}
	let err = valid(req);
	if (err !== "")
	{
		res.status(403).end(err);
	}
	else {
		console.log("readFleet");
		db.Fleet.findByPk(req.params.id).then((fleet) => {
			if (fleet === null || fleet.deletedAt !== null) {
				console.log("404");
				res.statusCode = 404;
				res.json({error: "404 - not found"});
			}
			else {
				res.json(fleet);
			}
		});
	}
});

router.post('/create', (req, res) => {
	if (req.manager.super) {
		let err = valid(req);
		if (err === "") {
			console.log("createFleet");
			db.Fleet.create({'name': req.body.name}).then((fleet) => {
				res.json(fleet);
			});
		}
		else {
			res.json({'error': err});
		}
	}
	else
	{
		res.status(403).end("You are not supermanager");
	}
});

router.post('/update', (req, res) => {
	if (req.manager.super) {
		let err = valid(req);
		if (err === "") {
			db.Fleet.update(
				{
					'name': req.body.name
				},
				{
					where: {
						id: req.body.id,
						deletedAt: null
					}
				}).then((result) => {
				console.log(result);
				if (result.length < 1) {
					console.log("400");
					res.statusCode = 400;
					res.json({error: "400 - bad request"});
				}
				else {
					db.Fleet.findById(req.body.id).then((fleet) => {
						res.json(fleet);
					});
				}
			});
		}
		else {
			res.json({'error': err});
		}
	}
	else
	{
		res.status(403).end("You are not supermanager");
	}
});

router.post('/delete', (req, res) => {
	if (req.manager.super) {
		let err = valid(req);
		if (err === "") {
			db.Fleet.findById(req.body.id).then((result) => {
				if (!result) {
					console.log("400");
					resp.statusCode = 400;
					resp.json({error: "400 - bad request"});
				}
				else {
					db.Fleet.destroy({
						where: {
							id: req.body.id,
							deletedAt: null
						}
					}).then(() => {
						res.json(result);
					});
				}
			});
		}
		else {
			res.json({'error': err});
		}
	}
	else
	{
		res.status(403).end("You are not supermanager");
	}
});

module.exports = router;