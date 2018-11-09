const express = require('express');
const app = express();

app.use('/api/*(fleets|vehicles|motions)', require('./routers/middleware'));
app.use('/api', require('./routers/index'));

const childProcess = require('child_process');

app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
	childProcess.spawn("node", ["log/logger.js"]);
});