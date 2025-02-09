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

    static createReservation = asyncHandler(async (req, res) => {
        const { user, showtime, seats } = req.body;

        const showtimeDetails = await showtime.findById(showtime);
        if (!showtimeDetails) {
            throw new CustomError("Showtime not found", 404);
        }

        const totalSeats = showtimeDetails.availableSeats - showtimeDetails.reservedSeats.length;
        if (totalSeats < seats.length) {
            throw new CustomError("Not enough seats available", 404);
        }

        showtimeDetails.reservedSeats.push(...seats);
        await showtimeDetails.save();

        const reservation = await Reservation.create({
            user,
            showtime, 
            seats 
        });

        res.status(201).json(reservation);
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

    static getReservationsReport = asyncHandler(async (req, res) => {
        const { period } = req.query;

        let startDate;
        if (period === 'daily') {
            startDate = new Date();;
            startDate.setHours(0, 0, 0, 0);
        } else if (period === 'weekly') {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - startDate.getDay());
        } else if (period === 'monthly') {
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() -1);
        }

        const reservations = await Reservation.find({
            createdAt: { $gte: startDate }
        }).populate('movie', 'title')
        .populate('showtime', 'date time');

       const totalRevenue = reservations.reduce((sum, res) => sum + res.showtime.price, 0);
       res.status(200).json({
        period,
        totalReservations: reservations.length,
        totalRevenue,
       });

    });
}

module.exports = ReservationController;