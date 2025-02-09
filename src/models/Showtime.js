const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ShowtimeSchema = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    theater: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableSeats: [
        {
            seatNumber: String,
            isReserved: Boolean
        }
    ],
    reservedSeats: [
        {
            type: Number
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Showtime', ShowtimeSchema);