const usersController = require("../controllers/usersController")
const express = require("express");
const router = express.Router();

router.get('/getAllUsers', usersController.getAllUsers);
router.get('/getTotalUsers', usersController.getTotalUsers);

module.exports = router;

