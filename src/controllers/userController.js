const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const asyncHandler = require('../utils/AsyncHandler');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');

class UserController {
    
    static reserveSeat = asyncHandler(async (req, res) => {
        const { id, showtimeId, movieId } = req.params;
        const { seatNumber } = req.body;

        if (!seatNumber) {
            throw new CustomError("Seat number is required", 400);
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await User.findById(id).session(session);
            if (!user) throw new CustomError("User not found", 404);

            const movie = await Movie.findById(movieId).session(session);
            if (!movie) throw new CustomError("Selected movie is not available", 404);

            const showtime = await Showtime.findOne({ _id: showtimeId, movie: movieId }).session(session);
            if (!showtime) throw new CustomError("No showtime allocated for this movie", 404);

            const seat = showtime.availableSeats.find(seat => seat.seatNumber === seatNumber);
            if (!seat || seat.isReserved) {
                throw new CustomError("Seat is not available, choose another one", 400);
            }

            seat.isReserved = true;
            await showtime.save({ session });

            const reservation = await Reservation.create([{ 
                user: user._id, 
                movie: movie._id, 
                showtime: showtime._id, 
                status: "reserved", 
                date: showtime.date, 
                seatNumber
            }], { session });

            await session.commitTransaction();
            session.endSession();

            res.status(201).json(reservation[0]);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    });

    static getMoviesAndShowtime = asyncHandler(async (req, res) => {
        const movies = await Movie.find().populate("showtimes");
        if (!movies.length) throw new CustomError("No movies found", 404);
        res.status(200).json(movies);
    });

    static availableSeats = asyncHandler(async (req, res) => {
        const { showtimeId } = req.params;

        const showtime = await Showtime.findById(showtimeId, { 
            availableSeats: { $elemMatch: { isReserved: false } } 
        });

        if (!showtime) throw new CustomError("No matching showtime found", 404);

        const available = showtime.availableSeats.map(seat => seat.seatNumber);
        if (!available.length) throw new CustomError("No available seats at this time", 400);

        res.status(200).json({ availableSeats: available });
    });

    static viewReservation = asyncHandler(async (req, res) => {
        const { userId, reservationId } = req.params;

        if (req.user.id !== userId) throw new CustomError("Unauthorized access", 403);

        const reservation = await Reservation.findOne({ _id: reservationId, user: userId })
            .populate("movie showtime");
        if (!reservation) throw new CustomError("Reservation not found", 404);

        res.status(200).json({ reservation });
    });

    static cancelReservation = asyncHandler(async (req, res) => {
        const { userId, reservationId } = req.params;
        if (req.user.id !== userId) throw new CustomError("Unauthorized access", 403);

        const reservation = await Reservation.findOne({ _id: reservationId, user: userId })
            .populate("showtime");

        if (!reservation) throw new CustomError("No reservation found", 404);

        if (new Date(reservation.date) <= new Date()) {
            throw new CustomError("Cannot cancel a past showtime reservation", 400);
        }

        const showtime = reservation.showtime;
        const seat = showtime.availableSeats.find(seat => seat.seatNumber === reservation.seatNumber);
        if (seat) {
            seat.isReserved = false;
            await showtime.save();
        }

        await Reservation.findByIdAndDelete(reservationId);

        res.status(200).json({ message: "Reservation canceled successfully", canceledReservation: reservation });
    });
}

module.exports = UserController;