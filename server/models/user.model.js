const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    hash: String,
    firstName: String,
    lastName: String,
    token: String
});

module.exports = mongoose.model('User',UserSchema);