const moongose = require('mongoose');
const {Schema} = moongose;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    resetToken: {type: String, default: null}
});

module.exports = new moongose.model("user", userSchema);