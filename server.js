const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');

const postRoutes = require('./data/routes/postRoutes');
const userRoutes = require('./data/routes/userRoutes');

const server = express();
const lama = express.json();
const logMiddleware = logger('dev');
const helmey = helmet();

server.use(lama, logMiddleware, helmey);

// import routes from user and post
server.use('/api/posts', postRoutes);
server.use('/api/users', userRoutes);

server.get('/', (req, res) => {
	res.json(`
		SERVER IS UP 
		`);
});

server.get('*', (req, res) => {
	res.status(404).send(`
	<h2>The link you searched for does not exist</h2>
	`);
});

module.exports = server;
