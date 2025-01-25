const User = require('../models/User')
const Reservation = require('../models/Reservation')

class UserController {

    static async reserveSit(req, res) {
        const { id } = req.body.id

        try {
            const user = User.findOne(id)

            if (!user) {
                console.error("User not found")
                res.status(500).json({msg: "Invalid user"})
            }

            await u
        } catch (error) {
            console.error(error)
            res.status(500).json({msg: "Server error"})
        }
    }

    static showAvailableSits(req, res) {
        try {
            const availableSits = Reservation.find({status: "available"})

            if (!availableSits) {
                console.error("No available sits")
                res.status(500).json({msg: "No available sits"})
            }

            res.status(200).json(availableSits)
        } catch (error) {
            console.error(error)
            res.status(500).json({msg: "Server error"})
        }
    }

}