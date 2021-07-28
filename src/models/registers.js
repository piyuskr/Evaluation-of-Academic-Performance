const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    cpass: {
        type: String,
        required: true
    },
    isAdmin: {
        type: String,
        default: "false",
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})



// generating tokens
studentSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.send("Generating tokens Error ho gya bro: " + error);
        console.log("Generating tokens Error ho gya bro: " + error);
    }
}


// password hashing using bcriptjs

studentSchema.pre("save", async function(next) {
    if (this.isModified("pass")) {

        this.pass = await bcrypt.hash(this.pass, 10);

        this.cpass = await bcrypt.hash(this.pass, 10);
    }

    next();
})

// need to create a Collection

const Register = new mongoose.model("Register", studentSchema);

module.exports = Register;