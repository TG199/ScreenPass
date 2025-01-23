const User = require('../models/User');

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

    static async promoteToadmin(req, res) {
        const { userId } = req.params;
        try {
            const user = await User.findByidAndUpdate(
            userId, 
            { role: 'admin' },
            { new: true});

            if (!user) {
                return res.status(404).json({msg: "User not found"});
            }
            res.status(200).json({msg: "User promoted to admin", user});
        } catch (err) {
            console.error("Error promoting user:", err);
            res.status(500).json({msg: "Server error", err: err.message});
        }
    }
}

module.exports = AdminController;