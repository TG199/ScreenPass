const Reservation = require('../models/Reservation');
const asyncHandler = require('../utils/AsyncHandler');
const CustomError = require('../utils/CustomError');


class ReservationController{
    static getAllReservations = asyncHandler(async (req, res) => {
        const reservations = await Reservation.find()
            .populate('user', 'name email')
            .populate('movie', 'title')
            .populate('showtime', 'date time');
        if (!reservations.length) throw new CustomError('No reservations found', 404);
        res.status(200).json(reservations);
    });

    static getReservation = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const reservation = await Reservation.findById(id)
            .populate('user', 'name email')
            .populate('movie', 'title')
            .populate('showtime', 'date time');
        if (!reservation) throw new CustomError("Reservation not found", 404);
        res.status(200).json(reservation);
    });

    static updateReservation = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const reservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .populate('user', 'name email')
            .populate('movie', 'title')
            .populate('showtime', 'date time');
        if (!reservation) throw new CustomError("Reservation not found", 404);
        res.status(200).json(reservation);
    });

    static deleteReservation = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) throw new CustomError("Reservation not found", 404);
        res.status(200).json({ msg: "Reservation deleted" });
    });
}

module.exports = ReservationController;