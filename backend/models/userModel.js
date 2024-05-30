const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, message = "all fields are required"],
    },
    email: {
        type: String,
        required: [true, message = "all fields are required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, message = "all fields are required"],
    },
    pic: {
        type: String,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;