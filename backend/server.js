require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to our website");
});

//connect to database 
mongoose.connect('mongodb://localhost:27017/ChatDb')
    .then(() => {
        //connect to port
        app.listen(port, () => {
            console.log(`Connected to Database and Listening on port ${port} !!`);
        })
    })
    .catch((err) => {
        console.log(err);
    })
