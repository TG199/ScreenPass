const router = require('express').Router();
const UserController = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
