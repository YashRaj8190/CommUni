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
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }
}, { timestamps: true });

// userSchema.pre('save', async function (next) {
//     if (!this.modified) {
//         next()
//     }
//     const salt = await bcrypt, genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// })

const User = mongoose.model("User", userSchema);

module.exports = User;