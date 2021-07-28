const Register = require("../models/registers");

const authrole = async(req, res, next) => {
    try {
        if (req.user.isAdmin === "true") {
            next();
            return;
        } else {
            res.status(401).send("unauthorise");
            return;
        }
        next();

    } catch (error) {
        res.status(401).send("Login First");
    }
}
module.exports = authrole;