let express = require('express'), 
app = express(),
bodyParser = require('body-parser'); 
const {errorHandler,clientErrorHandler,logErrors} = require('./utils/errorLog') //custome handlers

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Importing route
let routes = require('./api/routes/peopleRoutes'); 

//Register the route
routes(app); 

// Get an instance of the express Router
var router = express.Router();

// All of our routes will be prefixed with /api
app.use('/api', router);

// High level error handling and logging

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

module.exports = app;

