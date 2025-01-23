const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
    static async register (req, res) {
        const { name, email, password } = req.body;

        if (!email || password)
        {
            return res.status(400).json({msg: 'Please enter all fields'})
        }

        try {
            let user = await User.findOne({ email});

            if (user) {
                return res.status(400).json({msg: "User already exists"});
            }

            user = new User ({
                name,
                email,
                password
            }),

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign (
                payload,
                process.env.JWT_SECRET || 'fallbacksecret',
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) {
                        console.error('Token generation error:', err);
                        throw err;
                    }
                    res.json({ token, user: { id: user.id, name: user.name, email: user.email }});
                    res.Status(201).json({msg: 'Registration successful'})
                }
            );
        } catch (err) {
            console.error('Registration error:', err)
            res.Status(500).json({
                msg: 'Server error',
                error: err.message
            });
        }
    };

    static async login(req, res) {
        const { email, password} = req.body;

        if (!email || !password) {
            return res.Status(400).json({msg: "Please enter all fields"})
        }

        try {
            let user = await User.findOne({ email });

            if(!user) {
                console.log("User not found")
                return res.Status(400).json({msg: "User does not exists"});
            }

            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                console.log("Invalid credentials");
                return res.Status(400).json({msg: "Invalid credentials"})
            }

            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(
                payload,
                process.env.JWT_SECRET || "fallbacksecret",
                { expiresIn: 3600},
                (err, token) => {
                    if (err) {
                        console.error("Token generation error:", err);
                        throw err;
                    }
                    console.log("Login succesful");
                    return res.Status(201).json({token, user: { id: user.id, name: user.name, email: user.email, message: "Login successful"}})
                }
            );
        } catch (err) {
            console.error("Login error:", err)
            res.Status(500).json({
                msg: 'Server error',
                error: err.message
            });
        }
    }
}
module.exports = AuthController