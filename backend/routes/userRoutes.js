const express = require('express');
const { userSignUp, userLogin, allUsers, renameUser, updateUserPassword } = require("../controllers/userController")
const { protect } = require('../middleware/auth')
const router = express.Router();

router.post('/login', userLogin);
router.route('/').get(protect, allUsers).post(userSignUp);
router.route('/rename').put(protect, renameUser);
router.route('/updatePassword').put(protect, updateUserPassword);

module.exports = router;