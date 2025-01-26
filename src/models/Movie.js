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
        type: String,
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

module.exports = mongoose.model('Movie', MovieSchema);