const Register = require("../models/student");
const canvesdata = async(req, res, next) => {
    try {

        const foundUser = await Register.find({});


        console.log(foundUser);

        next();
    } catch (error) {
        // res.status(401).send("Login First");
        res.status(201).send("error");

    }
}
module.exports = canvesdata;