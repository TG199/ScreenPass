const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    posterImage: {
        type: Image,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
}, { timestamps: true});