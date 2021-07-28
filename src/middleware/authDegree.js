const Register = require("../models/student");

const authDegree = async(req, res, next) => {
    try {

        const userd = await Register.findOne({ degree: "B.tech" })
        req.user = userd;
        next();
    } catch (error) {
        // res.status(401).send("Login First");
        res.status(201).render("../views/login");

    }
}