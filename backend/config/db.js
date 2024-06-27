const mongoose = require("mongoose");

const ConnectDB = async () => {
    try {
        //console.log("MONGO_URI:", process.env.MONGO_URI);
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to Database : ${con.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = ConnectDB;
