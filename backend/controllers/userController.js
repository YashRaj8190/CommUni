const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require('bcryptjs');
const asyncHandler = require("express-async-handler");

const userSignUp = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        pic,
    });
    if (user) {
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        return res.status(400).json({ message: "Failed to create User" });
    }
});

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    return res.status(200).json({
        message: "Logged in successfully",
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        pic: userExists.pic,
        token: generateToken(userExists._id),
    });
};

const allUsers = asyncHandler(async(req, res) => {
    const keyword = req.query.search 
    ? {
        $or: [
            {name: { $regex: req.query.search, $options: "i"}},
            {email: { $regex: req.query.search, $options: "i"}},
        ]
    }
    : {};

    const users = await User.find(keyword).find({_id:{$ne: req.user._id }});
    res.send(users);
});

module.exports = { userSignUp, userLogin, allUsers };
