const User = require('../models/User');
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const asyncHandler = require('../utils/AsyncHandler');
const CustomError = require('../utils/CustomError');

class AdminController {
    static getAllUsers = asyncHandler(async (req, res) => {
        const users = await User.find().select('-password');
        if (!users.length) throw new CustomError("No users found", 404);
        res.status(200).json(users);
    });

    static getUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) throw new CustomError("User not found", 404);
        res.status(200).json(user);
    });

    static deleteUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new CustomError("User not found", 404);
        res.status(200).json({ message: "User deleted" });
    });

    static promoteToAdmin = asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { role: 'admin' },
            { new: true, runValidators: true }
        );
        if (!user) throw new CustomError("User not found", 404);
        res.status(200).json({ msg: "User promoted to admin", user });
    });

    static demoteToUser = asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { role: 'user' },
            { new: true }
        );
        if (!user) throw new CustomError("User not found", 404);
        res.status(200).json({ msg: "User demoted to user", user });
    });

    static createShowtime = asyncHandler(async (req, res) => {
        const { movie, date, time, availableSeats, theater, price } = req.body;
        if (!await Movie.findById(movie)) throw new CustomError("Movie not found", 404);
        const showtime = await Showtime.create({ movie, date, time, availableSeats, theater, price });
        res.status(201).json(showtime);
    });

    static updateShowtime = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const showtime = await Showtime.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!showtime) throw new CustomError("Showtime not found", 404);
        res.status(200).json(showtime);
    });

    static deleteShowtime = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const showtime = await Showtime.findByIdAndDelete(id);
        if (!showtime) throw new CustomError("Showtime not found", 404);
        res.status(200).json({ message: "Showtime deleted" });
    });

    static getShowtime = asyncHandler(async (req, res) => {
        const { movie } = req.params;
        if (!await Movie.findById(movie)) throw new CustomError("Movie not found", 404);
        const showtime = await Showtime.findOne({ movie });
        if (!showtime) throw new CustomError("Showtime not found", 404);
        res.status(200).json(showtime.time);
    });

    static getAllShowtimes = asyncHandler(async (req, res) => {
        const showtimes = await Showtime.find().populate("movie", "title");
        if (!showtimes.length) throw new CustomError("No showtimes available", 404);
        res.status(200).json(showtimes);
    });

    static getReservationsReport = asyncHandler(async( req, res) => {
        const reservations = await Reservation.find()
            .populate('user', 'name', 'email')
            .popilate('movie', 'title')
            .populate('showtime', 'date time theater price');

        if (!reservations.length){
            throw new CustomError("No reservations found, 404");
        }

        const totalRevenue = reservations.reduce((sum, res) => sum + res.showtime.price, 0);
        const totalReservations = reservations.length;
        const theaters = await Showtime.find().distinct('theater');

        res.status(200).json({
            totalReservations,
            totalRevenue,
            theaters,
            reservations
        });

    });
}

module.exports = AdminController;
