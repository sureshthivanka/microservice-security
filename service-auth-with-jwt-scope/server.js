const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwtAuthz = require('express-jwt-authz');

// Enable CORS
app.use(cors());

const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://thinkhash.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer

    audience:'https://clc.example.com',
    issuer: 'https://thinkhash.auth0.com/',
    algorithms: ['RS256']

});

// Enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Create timesheets API endpoint
app.post('/timesheets', checkJwt, jwtAuthz(['create:timesheets']), function(req, res){
    var timesheet = req.body;

    var userId = req.user['https://wso2.sample.com/email'];
    timesheet.user_id = userId;

  res.status(201).send(timesheet);
})

// Launch the API Server at localhost:8080
app.listen(8080);