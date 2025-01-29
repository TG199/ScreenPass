const User = require('../models/User')
const Reservation = require('../models/Reservation')
const Movie = require('../models/Movie')
const Showtime = require('../models/Showtime');
const asyncHandler = require('../utils/AsyncHandler');
const CustomError = require('../utils/CustomError');


class UserController {

    static reserveSit = asyncHandler(async (req, res) => {
        const { id, showtimeId, movieId } = req.params
        
        const user = await User.findById(id);

        if (!user) {
            throw new CustomError("User not found", 400);
        }

        const movieExists = await Movie.findById(movieId)

        if (!movieExists)
        {
            throw new CustomError("Can't reserve sit, selected movie is not availble", 404)
        }
        const movieShowtime = await Showtime.findOne({_id: showtimeId,
            movie: movieId
        }) 

        if (!movieShowtime){
            throw new CustomError("No showtime allocated for movie", 404);
        }

        if (movieShowtime.availableSeats === 0 ) {
            throw new CustomError("Seats are fully booked", 400);
        }

        await Showtime.updateOne(
            { _id: showtimeId },
            { $inc: { availableSeats: -1}}
        );
            const status = "reserved"

        const reservation = new Reservation({
            "user": user._id,
            "movie": movieExists._id,
            "showtime": movieShowtime._id,
            "status": status,
            "date": movieShowtime.date
        })

        await reservation.save()
        res.status(200).json(reservation)


        
    });

    static showAvailableShowtime(req, res) {
       
    }

}