const router = require('express').Router();
const ReservationController = require('../controllers/reservationController');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/users/reservations', isAuthenticated, ReservationController.getAllReservations);
router.get('/users/reservations/:id', isAuthenticated, ReservationController.getReservation);
router.post('/users/reservations/create-reservation', isAuthenticated, ReservationController.createReservation);
router.delete('/users/reservations/delete-reservation/:id', isAuthenticated, ReservationController.deleteReservation);
router.put('/users/reservations/update-reservation/:id', isAuthenticated, ReservationController.updateReservation);

module.exports = router;