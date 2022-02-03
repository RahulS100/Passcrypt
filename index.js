const express = require('express');
const next = require('next');
const app = express();

//checking if the enviroment is equal to production or not
const dev = process.env.NODE_ENV !== 'production';
const server = require('http').Server(app);

//geeting the next.js default server
const nextApp = next({dev});

//getting the next.js request handler from the next.js default Server Object
const handle = nextApp.getRequestHandler();

//load the enviroment variables in the Node Process
require('dotenv').config();
console.log("Loaded the ENVIROMENT VAR into the node's running process");

//MongoDB Connection after loading the env variables
require('./Models/dbconnect');

//Port for production and Development
const Port = process.env.PORT || 3000;

nextApp.prepare().then(() => {

    //parsing the json body
    app.use(express.json());

    //api routes for general works
    //for Authentication
    app.use('/api/auth', require('./api/auth'));
    app.use('/api/user', require('./api/userData'));
    app.use('/api/reset', require('./api/reset'));




    //setting up default request using the next.js default request handler
    //if the request path not match with other paths
    //then we return the next.js default handler to handle that request
    app.get("*", (req, res) => {
        return handle(req, res);
    })

    //listen to the server if in the production on a ENV PORT
    //in development mode the post 3000
    server.listen(Port, () => {
        console.log(`Up on the Port ${Port}`);
    }); 
})
.catch((error) => {
    console.log("Problem Running the Next Server:- ", error);
});