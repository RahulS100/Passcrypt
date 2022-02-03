const mongoose = require('mongoose');

//connection string for both development and production
const conStr = process.env.NODE_ENV !== "production" ? "mongodb://localhost:27017/passcrypt" : process.env.Mongo_Con_STR;


//creating a connection to mongodb
try {
    mongoose.connect(conStr, {useNewUrlParser: true}, (err) => {
        if(!err) { console.log("Success Connection to Mongo");  return;};
        throw err;
    });
} catch(e) {
    console.log("Connection Error:- ", e.message);
}
