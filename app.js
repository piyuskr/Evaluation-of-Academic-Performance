require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const http = require('http');
const cookieParser = require("cookie-parser");
var morgan = require('morgan');
const { findLastKey } = require("lodash");
const _ = require("lodash");

const mainRouter = require("./routes/index");
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("tiny"));

app.use(mainRouter);



app.listen(3000, function() {
    console.log("Server started on port: ", PORT);
});