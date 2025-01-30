const Movie = require('../models/Movie');
const asyncHandler = require('../utils/AsyncHandler');
const CustomError = require('../utils/CustomError');


class MovieController {
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
}
module.exports = MovieController;
