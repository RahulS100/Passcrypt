const jwt = require('jsonwebtoken');
const UserModel = require('../Models/usermodel');

//authentication middleware
const Auth = async (req, res, next) => {

    
    try {
        const token = req.headers.authorization;

        const {id} = jwt.verify(token, process.env.JWT_SEC);

        const user = await UserModel.findById(id);

        if(!user) {
            return res.status(404).send({message: "User not found!"});
        }

        req.userId = user._id.toString();
        next();

    } catch(e) {
        console.log("Auth Middlware:- ", e.message);
        res.status(500).send({message: "Internal Server Error"});
    }

}

module.exports = Auth;