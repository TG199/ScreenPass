const User = require('../models/User')
const Reservation = require('../models/Reservation')
const Movie = require('../models/Movie')
const Showtime = require('../models/Showtime');
const asyncHandler = require('../utils/AsyncHandler');
const CustomError = require('../utils/CustomError');
//const isAuthenticated = require('../middleware/isAuthenticated')


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
        const movies = await Movie.find().populate("showtimes");

        if (!movies.length) {
            throw new CustomError("No movies found", 404);
        }

        res.status(200).json(movies);
    
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

        res.status(200).json({availableSeats: available.map(seat => seat.seatNumber)});
    });

    static viewReservation = asyncHandler(async (req, res) => {
        const { userId, reservationId }  = req.params

        const user = req.user.id;
        if (user != userId) {
            throw new CustomError("Unathorized, user is not authorized", 403);
        }
        const userReservation = await User.findById(userId, {
            "reservations": {$elemMatch: { _id: reservationId}}
        });

        if (!userReservation) {
            throw new CustomError("No reservation found for this user", 404);
        }

        res.status(200).json({
            reservation: userReservation
        });
    });

    static cancelReservation = asyncHandler(async (req, res) => {
        const { userId, reservationId} = req.params;

        const user = req.user.id;

        if (user != userId) {
            throw new CustomError("Unathorized, user is not authorized", 403);
        }

         
        const reservation = await User.findOne(
            {_id: userId},
            {reservations: {$elemMatch: { _id: reservationId}}
        }).populate({
            path:  "reservations.showtime",
            select: "availableSeats date"
        })

        if (!reservation || ! reservation.reservations.length) {
            throw new CustomError("No reservation found", 404);
        }
        const currentReservation = reservation.reservations[0];
        const  showtime = currentReservation.showtime;

        const upcoming = new Date(currentReservation.date) > new Date();

        if (!upcoming) {
            throw new CustomError("You can't cancel reservation for past showtime", 400);
        }

        await Reservation.findByIdAndDelete(reservationId);

        const seat = showtime.availableSeats.find(seat => seat.seatNumber === currentReservation.seatNumber);

        if (seat) {
            seat.isReserved = false;

            await showtime.save();
        } else {
            throw new CustomError("Seat not found in Showtime available seats", 404);
        }

        res.status(200).json({
            message: "Reservation canceled",
            canceledReservation: {
                reservationId,
                movie: currentReservation.movie,
                showtime: currentReservation.showtime,
                seatNumber: currentReservation.seatNumber,
                date: currentReservation.date
            }
        });
    })

}