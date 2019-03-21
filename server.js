const express = require('express');
const morgan = require('morgan');

const server = express();

server.get('/', (req, res) => {
	res.send('SERVER IS WORKING');
});
module.exports = server;
