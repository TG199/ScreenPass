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
           
    }

    static async updateMovie(req, res) {

    }

    static async deleteMovie(req, res) {

    }
    static async getAllMovies(req, res) {

    }

    static async getAllReservations(req, res) {

    }
}

module.exports = AdminController;