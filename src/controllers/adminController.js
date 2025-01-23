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
        const { id } = req.params.id
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
        const { id } = req.params.id;
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

    }

    static async updateShowtime(req, res) {

    }

    static async deleteShowtime(req, res) {

    }

    static async getAllShowtimes(req, res) {

    }

    static async getShowtime(req, res) {

    }
    // Reservation operations}
    static async getReservation(req, res) {

    }

    static async deleteReservation(req, res) {

    }

    static async updateReservation(req, res) {
    
    }
    static async getAllReservations(req, res) {

    }

}

module.exports = AdminController;