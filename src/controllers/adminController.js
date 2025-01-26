const User = require('../models/User');
const Movie = require('../models/Movie');
const Reservation = require('../models/Reservation');
const Showtime = require('../models/Showtime');


class AdminController {
    static async getAllUsers(req, res) {
        try {
            const users = await User.find().select('-password');
            res.status(200).json(users);
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }
    static async getUser(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findById(id)
            if(!user) {
                return res.status(404).json({msg: "User not found"});
            }
            res.status(200).json(user);
        } catch (err) {
            console.error("Error getting user:", err);
            res.status(500).json({msg: "Server error", err: err.message});   
        }
    }
    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findById(id)
            if (!user) {
                return res.status(404).json({msg: "User not found"});
            }
            await user.remove();
            res.status(200).json({msg: "User deleted"});
        } catch (err) {
            console.error("Error deleting user:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    static async promoteToAdmin(req, res) {
        const { userId } = req.params;
        try {
            const user = await User.findByidAndUpdate(
            userId, 
            { role: 'admin' },
            { new: true});

            if (!user) {
                return res.status(404).json({msg: "User not found"});
            }
            user.save();
            res.status(200).json({msg: "User promoted to admin", user});
        } catch (err) {
            console.error("Error promoting user:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }
    static async demoteToUser(req, res) {
        const { userId } = req.params;
        try {
            const user = await User.findByidAndUpdate(
            userId, 
            { role: 'user' },
            { new: true});

            if (!user) {
                return res.status(404).json({msg: "User not found"});
            }
            user.save();
            res.status(200).json({msg: "User demoted to user", user});
        } catch (err) {
            console.error("Error demoting user:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    // Movie operations
    static async createMovie(req, res) {
        const { 
        title,
        description,
        posterImage,
        genre,
        rating,
        releaseDate,
        duration
          } = req.body;
        try {
            const movie = new Movie({
                title,
                description,
                posterImage,
                genre,
                rating,
                releaseDate,
                duration
            });
            await movie.save();
            res.status(201).json(movie);
        } catch (err) {
            console.error("Error creating movie:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    static async updateMovie(req, res) {
        const { title, description, posterImage, genre, rating, releaseDate, duration } = req.body;

        try {
            const movie = await Movie.findById(req.params.id);
            if (!movie) {
                return res.status(404).json({msg: "Movie not found"});
            }
            movie.title = title;
            movie.description = description;
            movie.posterImage = posterImage;
            movie.genre = genre;
            movie.rating = rating;
            movie.releaseDate = releaseDate;
            movie.duration = duration;

            await movie.save();
            res.status(200).json(movie);
        } catch (err) {
            console.error("Error updating movie:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    static async deleteMovie(req, res) {
        const { id } = req.params;
        try {
            const movie = await Movie.findById(id);
            if (!movie) {
                return res.status(404).json({msg: "Movie not found"});
            }
            await movie.remove();
        } catch (err) {
            console.error("Error deleting movie:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    static async getAllMovies(req, res) {
        try {
            const movies = await Movie.find();
            res.status(200).json(movies);
        } catch (err) {
            console.error("Error fetching movies:", err)
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }


    // Showtime operations
    static async createShowtime(req, res) {
        const { movie, date, time, availableSeats } = req.body;
        try {
            const movie_ = await Movie.findById(movie);
            if (!movie_) {
                return res.status(404).json({msg: "Movie not found"});
            }
            const showtime = new Showtime({
                movie,
                date,
                time,
                availableSeats
            });
            await showtime.save();
            res.status(201).json(showtime);
        } catch (err) {
            console.error("Error creating showtime:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }


    static async updateShowtime(req, res) {
        const { movie, date, time, availableSeats } = req.body;
        if (!movie || !date || !time || !availableSeats) {
            return res.status(400).json({msg: "All fields are required"});
        }

        try {
            const showtime = await Showtime.findById(req.params.id);
            if (!showtime) {
                return res.status(404).json({msg: "Showtime not found"});
            }
            showtime.movie = movie;
            showtime.date = date;
            showtime.time = time;
            showtime.availableSeats = availableSeats;

            await showtime.save();
            res.status(200).json(showtime);
        } catch (err) {
            console.error("Error updating showtime:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    static async deleteShowtime(req, res) {
        const { movie } = req.body;
        try {
            const showtime = await Showtime.findById(movie);
            if (!showtime) {
                return res.status(404).json({msg: "Showtime not found"});
            }
            await showtime.remove();
            res.status(200).json({msg: "Showtime deleted"});
        } catch (err) {
            console.error("Error deleting showtime:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    static async getAllShowtimes(req, res) {
        try {
            const showtimes = await Showtime.find();
            res.status(200).json(showtimes);
        } catch (err) {
            console.error("Error fetching showtimes:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    static async getShowtime(req, res) {
        const { movie } = req.body;
        try {
            const showtime = await Showtime.findById(movie);
            if (!showtime) {
                return res.status(404).json({msg: "Showtime not found"});
            }
            res.status(200).json(showtime);
        } catch (err) {
            console.error("Error getting showtime:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }
    // Reservation operations}
    static async getReservation(req, res) {
        const { movie } = req.body;
        try {
            const reservation = await Reservation.findById(movie);
            if (!reservation) {
                return res.status(404).json({msg: "Reservation not found"});
            }
            res.status(200).json(reservation);
        } catch (err) {
            console.error("Error getting reservation:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }  
    }

    static async deleteReservation(req, res) {
        const { movie } = req.body;
        try {
            const reservation = await Reservation.findById(movie);
            if (!reservation) {
                return res.status(404).json({msg: "Reservation not found"});
            }
            await reservation.remove();
            res.status(200).json({msg: "Reservation deleted"});
        } catch (err) {
            console.error("Error deleting reservation:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

    static async updateReservation(req, res) {
        const { movie, user, showtime, date, status } = req.body;
        if (!movie || !user || !showtime || !date || !status) {
            return res.status(400).json({msg: "All fields are required"});
        }

        try {
            const reservation = await Reservation.findById(req.params.id);
            if (!reservation) {
                return res.status(404).json({msg: "Reservation not found"});
            }
            reservation.movie = movie;
            reservation.user = user;
            reservation.showtime = showtime;
            reservation.date = date;
            reservation.status = status;

            await reservation.save();
            res.status(200).json(reservation);
        } catch (err) {
            console.error("Error updating reservation:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }
    static async getAllReservations(req, res) {
        try {
            const reservations = await Reservation.find();
            res.status(200).json(reservations);
        } catch (err) {
            console.error("Error fetching reservations:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }

}

module.exports = AdminController;