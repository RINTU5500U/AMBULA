const mongoose = require('mongoose');
const moment = require('moment')

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['Admin', 'Reader'],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: String,
        // required: true,
        unique: true
    },
    longitude: {
        type: String,
        // required: true,
        unique: true
    },
    excluded: {
        type: Boolean,
        default: false
    },
    createdAt: { 
        type: String,
        default: moment().format("DD-MM-YYYY  h:mm:ss a") 
    },
    updatedAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema) 