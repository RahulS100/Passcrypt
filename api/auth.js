const router = require('express').Router();
const UserModel = require('../Models/usermodel');
const KeysModel = require('../Models/keymodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//signup route
router.post('/', async (req, res) => {

    const {name, email, password} = req.body;

    try {

        //check if the email already exist
        const user = await UserModel.findOne({email: email});

        if(user) {
            return res.status(401).send({message: "User Exits with this Email!"});
        }

        if(password.length < 8) {
            return res.status(401).send({message: "password is not Strong Enought"});
        }

        //if user not exits then create a new user object with data receive in body
        const hash = await bcrypt.hash(password, 10);
        
        const newUser = new UserModel({
            name,
            password: hash,
            email
        });

        await newUser.save();


          //creating a new Keys document for user
          const keysDoc = new KeysModel({
            user: newUser._id,
            keys: []
        });
        //saving the keys document
        await keysDoc.save();


        //sign a jsonwebtoken for verification
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SEC);
        res.status(200).send({message: "Success", token: token});


    } catch(e) {
        console.log("Sigup:- ", e.message);
        res.status(500).send({message: "Server Error"});
    }

});


//login route
router.post('/login', async (req, res) => {

    try {

    const {email, password} = req.body;

    const user = await UserModel.findOne({email: email});

    if(!user) {
        return res.status(404).send({message: "User Not Found"})
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if(!isCorrect) {
        return res.status(401).send({message: "Wrong password or email!"});
    }

    const token = await jwt.sign({id: user._id}, process.env.JWT_SEC);

    res.status(200).send({message: "Success", token: token});


    } catch(e) {
        console.log("Login:- ", e.message);
        res.status(500).send({message: "Internal Server Error"});
    }

});

module.exports = router;