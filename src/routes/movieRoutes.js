const router = require('express').Router();
const MovieController = require('../controllers/movieController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/users/movies', isAuthenticated, MovieController.getAllMovies);
router.get('/users/movies/:id', isAuthenticated, MovieController.getMovie);
