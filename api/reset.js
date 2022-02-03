const router = require('express').Router();
const UserModel = require('../Models/usermodel');
const crypto = require('crypto');
const sendMail = require('../Helper/sendToken');
const req = require('express/lib/request');
const bcrypt = require('bcrypt');

//route for generating the token and sending
router.post('/', async (req, res) => {

    try {
        const email = req.body.email;

        const user = await UserModel.findOne({email: email.toLowerCase()});

        if(!user) {
            return res.status(404).send({message: "User Not Found"});
        }

        //generate a unique token
        const token = crypto.randomBytes(32).toString('hex');

        
        //saving token to user
        user.resetToken = token;
        console.log(user);
        await user.save();


        //calling send mail to send the token to user mail
        sendMail(user.email, token);
        res.status(200).send({message: "Mail Sended!"});


    } catch (err) {
        console.log("Send Reset Mail:- ", err.message);
        res.status(500).send({message: "Internal Server Error"});
    }

});


//route for resetting the password
router.post('/token', async (req, res) => {
        try {
            const {token, newpassword} = req.body;

            if(!token) {
                return res.status(401).send({message: "Unauthorized"});
            }

            if(newpassword.length < 8) {
                return res.status(401).send({message: "Password Must be 8 Character long"});
            }

            const user = await UserModel.findOne({resetToken: token});

            if(!user) {
                return res.status(404).send({message: "User Not found!"});
            }

            user.password = await bcrypt.hash(newpassword, 10);
            user.resetToken = null

            await user.save();

            res.status(200).send({message: "Password Chnaged Success!"})

        } catch (err) {
            console.log("Token Verify:- ", err.message);
            res.status(500).send({message: "Internal Server Error!"});
        }
});



module.exports = router;