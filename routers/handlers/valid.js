module.exports.valid = function(req) {
	req.url = req.originalUrl;
	let errorMsg = "";
	console.log(req.method);
	console.log(req.url);
	switch(req.method) {
		case 'GET':
		{
			console.log(req.params);
			console.log(req.url.split("/")[3]);
			switch (req.url.split("/")[3])
			{
				case 'read':
				{
					if (!(parseInt(req.params.id, 10) > 0))
					{
						errorMsg += "error: id argument is not valid; ";
					}
					break;
				}
				case 'readall':
				{
					switch (req.url.split("/")[2]) {
						case "vehicles":
						{
							if (!(parseInt(req.params.fleetId, 10) > 0))
							{
								errorMsg += "error: fleetId argument is not valid; ";
							}
							break;
						}
					}
					break;
				}
				case 'milage':
				{
					if (!(parseInt(req.params.vehicleId, 10) > 0))
					{
						errorMsg += "error: vehicleId argument is not valid; ";
					}
					break;
				}
			}
			break;
		}
		case 'POST':
		{
			console.log(req.body);
			switch (req.url.split("/")[3]) {
				case 'create':
				{
					switch(req.url.split("/")[2])
					{
						case "fleets":
						{
							if (!req.body.name)
							{
								errorMsg += "error: name is not found; ";
							}
							break;
						}
						case "motions":
						{
							let args = ["latitude", "longitude", "time", "vehicleId"];
							for(let i = 0; i < args.length; i++)
							{
								if (!(args[i] in req.body))
								{
									errorMsg += `error: ${args[i]} argument is not valid; `;

								}
								else if (args[i].toLowerCase().indexOf("id") !== -1
									&& !(parseInt(req.body[args[i]], 10) > 0))
								{
									errorMsg += `error: ${args[i]} argument is not valid; `;
								}
							}
							break;
						}
						case "vehicles":
						{
							let args =["name", "fleetId"];
							for(let i = 0; i < args.length; i++)
							{
								if (!(args[i] in req.body))
								{
									errorMsg += `error: ${args[i]} argument is not valid; `;
								}
								else if (args[i].toLowerCase().indexOf("id") !== -1
											&& !(parseInt(req.body[args[i]], 10) > 0))
								{
									errorMsg += `error: ${args[i]} argument is not valid; `;
								}
							}
							break;
						}
					}
					break;
				}
				case 'delete':
				{
					if (!(parseInt(req.body.id, 10) > 0))
					{
						errorMsg += "error: id argument is not valid; ";
					}
					break;
				}
				case 'update':
				{
					if (!(parseInt(req.body.id, 10) > 0))
					{
						errorMsg += "error: id argument is not valid; ";
					}
					break;
				}
				case 'register':
				{
					let args =["email", "password"];
					for(let i = 0; i < args.length; i++)
					{
						if (!(args[i] in req.body))
						{
							errorMsg += `error: ${args[i]} argument is not valid; `;
						}
					}
					break;
				}
				case 'login':
				{
					let args =["email", "password"];
					for(let i = 0; i < args.length; i++)
					{
						if (!(args[i] in req.body))
						{
							errorMsg += `error: ${args[i]} argument is not valid; `;
						}
					}
					break;
				}
			}
			break;
		}
	}
	if (errorMsg === "")
	{
		console.log("all is good");
	}
	else
	{
		console.log("not valid - " + errorMsg)
	}
	return errorMsg;
};