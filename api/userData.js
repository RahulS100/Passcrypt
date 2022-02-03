const router = require('express').Router();
const Auth = require('../Middleware/Auth');
const UserModel = require('../Models/usermodel');
const KeysModel = require('../Models/keymodel');
const jwt = require('jsonwebtoken');
const {encryptKey, decryptKey} = require('../Helper/en_de_helper');
const bcrypt = require('bcrypt');




        //*************************************************
        //*********************Note************************
        //*************************************************
        //the don't put the encryption logic for encryption
        //of password in this repo you and implement your own
        //encryption logic and then pass the user sumitted key
        //and return it after encryption and save it into DB
        //**************************************************
        //**************************************************
        //**************************************************





//get Route for getting the user data
router.get('/', Auth, async (req, res) => {

    const {userId} = req;

    try {
        
    const user = await UserModel.findById(userId);

    if(!user) return res.status(404).send({message: "User not found!"});

    //transforming the user Data
    const userDataForSending = {
        name: user.name,
        email: user.email,
    }

    //sending back the transformed data
    res.status(200).send(userDataForSending);

    } catch (error) {
        console.log('Get User Data:- ', error.message);
        res.status(500).send({message: "Internal Server Error"});
    }
});


//route for getting all keys
router.get('/keys', Auth, async (req, res) => {

  try {
    
    const {userId} = req;

    const user = await UserModel.findById(userId);

    if(!user) {
        return res.status(404).send({message: "User Not found"});
    }

    const keysDoc = await KeysModel.findOne({user: user._id});

    if(!keysDoc) {
        const newKeysDoc = new KeysModel({
            user: user._id,
            keys: []
        });
        await newKeysDoc.save();
        return res.status(200).send([]);
    }

    //check if the keys array is not empty
    //and only then transform the array
    let keysToSend = [];
    if(keysDoc.keys.length > 0) {
         //transforming all the keys
         keysToSend = keysDoc.keys.map(keyItem => {
            //extracting the key from the the testing jwt
            const decryptedKey = decryptKey(keyItem.key);

        return {
            key: decryptedKey,
            keyfor: keyItem.keyfor,
            id: keyItem._id
        }
    });
}

    //sending back all the keys
    res.status(200).send(keysToSend);

  } catch (err) {
      console.log("keys fetch:- ", err.message);
      res.status(500).send({message: "Internal Server Error"});
  }
});


//route for adding a new key
router.post('/keys/newkey', Auth, async (req, res) => {

    try {
    
        const {keyfor, key} = req.body;

        const {userId} = req;
    
        const user = await UserModel.findById(userId);
    
        if(!user) {
            return res.status(404).send({message: "User Not found"});
        }
    
        const keysDoc = await KeysModel.findOne({user: user._id});
    
        if(!keysDoc) {
            return res.status(404).send({message: "Keys Not Found"});
        }
    

        //just for test encrypt the keys with jwt
        const encJwtKey = encryptKey(key);

        const newKeyData = {
            keyfor: keyfor,
            key: encJwtKey
        }

        keysDoc.keys.push(newKeyData);
        await keysDoc.save();
    
        res.status(200).send({message: "Success new Key Added"});
      } catch (err) {
          console.log("keys fetch:- ", err.message);
          res.status(500).send({message: "Internal Server Error"});
      }

});


//deleting a key
router.delete('/keys/delete/:keyId', Auth, async (req, res) => {
   
    try {

        const keyId = req.params.keyId;
        
        
        const {userId} = req;
        
        const user = await UserModel.findById(userId);
    
        if(!user) {
            return res.status(404).send({message: "User Not found"});
        }
    
        const keysDoc = await KeysModel.findOne({user: user._id});
    
        if(!keysDoc || keysDoc.keys < 0) {
            return res.status(404).send({message: "Keys Not Found, Or Key Not Found"});
        }


        //finding the index of the key for deleting using the keyId
        const deleteKeyIndex = keysDoc.keys.findIndex(key => keyId === key._id.toString());
        
        
        //removing the key from the array of keys
        keysDoc.keys.splice(deleteKeyIndex, 1);

        //save the keysDoc after removing key
        await keysDoc.save();
    
        res.status(200).send({message: "Success Deleted the Key!"});

      } catch (err) {
          console.log("delete:- ", err.message);
          res.status(500).send({message: "Internal Server Error"});
      }

    });

    

//route for changing the key
router.put('/keys/update/:keyId', Auth, async (req, res) => {

    try {
        
        const keyId = req.params.keyId;
        const {key, keyfor} = req.body;
        const {userId} = req;

        const user = await UserModel.findById(userId);

        if(!user) {
            return res.status(404).send({message: "User Not Found!"});
        }

        const keyDoc = await KeysModel.findOne({user: user._id.toString()});

        if(!keyDoc) {
            return res.status(404).send({message: "Key Not Found!"});
        }


        
        const keyToUpdate = keyDoc.keys.find(key => {
            return key._id.toString() === keyId;
        });
        
        //check if sended the both key and keyfor for updating or
        //just one from them is sended so old saved again
        keyToUpdate.keyfor = keyfor ? keyfor : keyToUpdate.keyfor;



        //*************************************************
        //*********************Note************************
        //the don't put the encryption logic for encryption
        //of password in this repo you and implement your
        //own encryption logic and then pass the user sumitted
        //key and return it after encryption and save it into DB
        //**************************************************
        //**************************************************

        keyToUpdate.key = key ? encryptKeyFun(key) : keyToUpdate.key;
        



        await keyDoc.save();
        res.status(200).send({message: "Key Updated Success!"});

    } catch (err) {
        console.log("Update the key:- ", err.message);
        res.status(500).send({message: "Internal Server Error!"});
    }
});



//route for updating the account email and name
router.put('/profile/update',Auth , async (req, res) => {
        const {userId} = req;

        try {
            
        const {name, email, password} = req.body;

        const user = await UserModel.findById(userId);

        if(!user) {
            return res.status(404).send({message: "User Not Found!"});
        }

        isCorrect = await bcrypt.compare(password, user.password);

        if(!isCorrect) return res.status(401).send({message: "Password Incorrect!"});

        user.name = name || user.name;
        user.email = email;

        await user.save();
        res.status(200).send({message: "Profile Update Success"})

        } catch (error) {
            console.log("Update the profile:- ", error);
            res.status(500).send({message: "Server Error"});
        }
});

module.exports = router;