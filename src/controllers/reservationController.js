const Reservation = require('../models/reservationModel');
const User = require('../models/userModel');
const Movie = require('../models/movieModel');

class ReservationController {
    static async getAllReservations(req, res) {
        try {
            const reservations = await Reservation.find();
            res.status(200).json(reservations);
        } catch (error) {
            console.error(error);
            res.status(500).json({msg: "Server error"});
        }
    }
}