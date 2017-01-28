const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const routes = require('./api/routes')

app.set('port', 3000)

app.use(bodyParser.json())

app.use((req, res, next) => {
	console.log(req.method, req.url);
	next()
})

app.use('/', routes)

const server = app.listen(app.get('port'), function() {
	const port = server.address().port;
	console.log('Hello on port ' + port);
});
