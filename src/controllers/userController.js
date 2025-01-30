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

        const { seatNumber } = req.body;

        if (!seatNumber) {
            throw new CustomError("Seat number is required", 400);
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

        const seat = movieShowtime.availableSeats.find(seat => seat.seatNumber === seatNumber)

        if (!seat) {
            throw new CustomError("Seat is not available, try another one", 400);
        }
        seat.isReserved = true;

        await movieShowtime.save();

        const status = "reserved";
        const reservation = new Reservation({
            "user": user._id,
            "movie": movieExists._id,
            "showtime": movieShowtime._id,
            "status": status,
            "date": movieShowtime.date,
            "seatNumber": seatNumber
        })

        await reservation.save()
        res.status(200).json(reservation)


        
    });

    static getMoviesAndShowtime = asyncHandler(async (req, res) => {
    
    });

    static availableSeats = asyncHandler(async (req, res) => {
        const { showtimeId } = req.params

        const user = req.user

        if (!user) {
            throw new CustomError("Unathorized", 401);
        }

        const matchingShowtime = await Showtime.findById(showtimeId, {
            "availableSeats": {$elemMatch: { isReserved: false} }
        });

        if (!matchingShowtime) {
            throw new CustomError("No matching showtime found", 404)
        }

        const  available = matchingShowtime.availableSeats.filter(seat => seat.isReserved === false);

        if (available.length === 0) {
            throw new CustomError("There are no available seats at this time");
        }

        res.status(200).json({availableSeats: available});
    });

    static viewOrCancel = asyncHandler(async (req, res) => {

    })

}