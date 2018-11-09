const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const valid = require("./valid").valid;

router.use(bodyParser.json());

router.post('/register', async (req, res) => {
	let err = valid(req);
	if (err === "")
	{
		req.body.password = bcrypt.hashSync(req.body.password);
		console.log(req.body);
		await db.Managers.create(req.body)
			.then(() => {
				res.end('Registration is successfully');
			})
			.catch(() => {
				res.status(501).end('Error registration');
			});
	}
	else
	{
		res.status(501).end(err);
	}
});

router.post('/login', async (req, res) => {
	let err = valid(req);
	if (err === "") {
		let manager = await db.Managers.find({
			where: {
				email: req.body.email
			}
		});
		if (manager && bcrypt.compareSync(req.body.password, manager.password)) {
			res.end(jwt.sign({
				id: manager.id,
				email: req.email
			}, "secret", {expiresIn: 3000}));
		}
		else
		{
			res.status(400).end("Manager is no found");
		}
	}
	else
	{
		res.status(501).end(err);
	}
});

module.exports = router;