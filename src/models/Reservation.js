const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    showtime: {
        type: Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true
    },

    date: {
        type: Date,
        required: true
    },
    
    status: {
        type: String,
        enum: ['available', 'reserved'],
        default: 'available',
        required: true
    }
    }, {timestamps: true});

module.exports = mongoose.model('Reservation', ReservationSchema);