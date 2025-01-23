const router = require('express').Router();
const AdminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/users', authMiddleware, isAdmin, AdminController.getAllUsers);
router.delete('/users/:id', authMiddleware, isAdmin, AdminController.deleteUser);
router.put('/users/:id/promote', authMiddleware, isAdmin, AdminController.promoteToAdmin);

module.exports = router;