const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    mfaSecret: {type: String, default: ''},
    isMfaEnabled: {type: Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);