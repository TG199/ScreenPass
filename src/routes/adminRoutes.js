const router = require('express').Router();
const AdminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');
const authMiddleware = require('../middleware/authMiddleware');

//User crud operations
router.get('/admin/users', authMiddleware, isAdmin, AdminController.getAllUsers);
router.get('admin/users/:id', authMiddleware, isAdmin, AdminController.getUser);
router.delete('admin/users/:id', authMiddleware, isAdmin, AdminController.deleteUser);

//User role operations
router.put('admin/users/promote:id', authMiddleware, isAdmin, AdminController.promoteToAdmin);
router.put('admin/users/demote:id', authMiddleware, isAdmin, AdminController.demoteToUser);

//Crud operations for movies
router.post('admin/movies/create-movie', authMiddleware, isAdmin, AdminController.createMovie);
router.put('admin/movies/update-movie/:title', authMiddleware, isAdmin, AdminController.updateMovie);
router.delete('/movies/delete-movie/:title', authMiddleware, isAdmin, AdminController.deleteMovie);
router.get('admin/movies', authMiddleware, isAdmin, AdminController.getAllMovies);

//Crud operations for resevations
router.get('admin/reservations', authMiddleware, isAdmin, AdminController.getAllReservations);
router.get('admin/reservations/:id', authMiddleware, isAdmin, AdminController.getReservation);
router.delete('admin/reservations/:id', authMiddleware, isAdmin, AdminController.deleteReservation);
router.put('admin/reservations/:id', authMiddleware, isAdmin, AdminController.updateReservation);


module.exports = router;