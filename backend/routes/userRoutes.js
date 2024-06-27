const express = require('express');
const { userSignUp, userLogin, allUsers } = require("../controllers/userController")
const { protect } = require('../middleware/auth')
const router = express.Router();

router.post('/login', userLogin);
router.route('/').get(protect, allUsers).post(userSignUp);

module.exports = router;