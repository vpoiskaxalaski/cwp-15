const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('./db');

router.all('/*', async (req, res, next) => {
	console.log('Auth...');
	let h;
	if (h = req.header('Authorization'))
	{
		let _h = h.split(' ');
		console.log(_h);
		if (_h[0] !== 'Bearer')
		{
			res.status(401).send('401: Bearer');
		}
		else
		{
			if (req.manager === undefined)
			{
				let token = _h[1];
				console.log(`token = ${token}`);
				jwt.verify(token, 'secret', async (err, dec) => {
					if (!err)
					{
						console.log("ok");
						console.log(dec);
						await db.Managers.findByPk(dec.id).then((itm) =>
						{
							if (itm)
							{
								console.log(itm);
								console.log("1");
								req.manager = itm.get({raw: true});
								next();
							}
							else
							{
								console.log("2");
								res.status(403).send('403');
							}
						});
					}
					else
					{
						console.log("3");
						res.statusCode = 403;
						console.log(err);
						res.send(err);
					}
				});
			}
			else
			{
				res.status(401).send('401: Error');
			}
		}
	}
	else
	{
		res.status(401).send('401: Authorization');
	}
});

module.exports = router;