const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const cors = require('cors');
const ConnectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
dotenv.config();
const { notFound, errorHandler } = require('./middleware/error');
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Welcome to our website");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler)

// ConnectDB();
// app.listen(port, () => {
//     console.log(`Listening on port ${port} !!`);
// });

//connect to database 
mongoose.connect('mongodb://localhost:27017/CommUni')
    .then(() => {
        //connect to port
        app.listen(port, () => {
            console.log(`Connected to Database and Listening on port ${port} !!`);
        })
    })
    .catch((err) => {
        console.log(err);
    })
