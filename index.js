require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
const MongoStore = require("connect-mongo");
const port = 5000;
const app = express();
const { db } = require('./db');
const authRouter = require('./auth');
const routeRouter = require('./route.js');

//body-parser configuration 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

//session configuration
app.use(session({
	secret: process.env.SESSION_SECRET, //secret key for session
	resave: false,
	saveUninitialized: true,
	store: MongoStore.create({
		client: db.getClient(),
		dbName: 'testdb',
		collectionName: "sessions",
		stringify: false,
		autoRemove: "interval",
		autoRemoveInterval: 1
	})
}));

app.use('/', authRouter);
app.use('/', routeRouter);

// Swagger API configuration
const swaggerUi = require('swagger-ui-express');
const swaggerJson = require('./openapi.json');

const cors = require('cors');
//EXPRESS MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
//API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
//JSON
app.get('/swagger-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerJson);
});

//server listening
app.listen(port, () => {
	console.log(`server started on ${port}`);
});