const moongose = require('mongoose');
const {Schema} = moongose;

const keySchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "user"},
    keys: [{
        keyfor: {type: String, required: true},
        key: {type: String, required: true}
    }]
});

module.exports = new moongose.model("keys", keySchema);