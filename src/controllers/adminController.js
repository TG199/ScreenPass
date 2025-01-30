const User = require('../models/User');
const Movie = require('../models/Movie');
const Reservation = require('../models/Reservation');
const Showtime = require('../models/Showtime');
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

    // Movie Operations
    static createMovie = asyncHandler(async (req, res) => {
        const { title, description, posterImage, genre, rating, releaseDate, duration } = req.body;
        if (!title || !description || !posterImage) throw new CustomError('Please provide all required fields', 400);
        const movie = await Movie.create({ title, description, posterImage, genre, rating, releaseDate, duration });
        res.status(201).json(movie);
    });

    static updateMovie = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!movie) throw new CustomError("Movie not found", 404);
        res.status(200).json(movie);
    });

    static deleteMovie = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const movie = await Movie.findByIdAndDelete(id);
        if (!movie) throw new CustomError("Movie not found", 404);
        res.status(200).json({ message: "Movie deleted successfully" });
    });

    static getAllMovies = asyncHandler(async (req, res) => {
        const movies = await Movie.find();
        if (!movies.length) throw new CustomError("No movies found", 404);
        res.status(200).json(movies);
    });

    // Showtime Operations
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

    static getAllShowtimes = asyncHandler(async (req, res) => {
        const showtimes = await Showtime.find().populate("movie", "title");
        if (!showtimes.length) throw new CustomError("No showtimes available", 404);
        res.status(200).json(showtimes);
    });

    static getShowtime = asyncHandler(async (req, res) => {
        const { movie } = req.params;
        if (!await Movie.findById(movie)) throw new CustomError("Movie not found", 404);
        const showtime = await Showtime.findOne({ movie });
        if (!showtime) throw new CustomError("Showtime not found", 404);
        res.status(200).json(showtime.time);
    });

    // Reservation Operations
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

module.exports = AdminController;
