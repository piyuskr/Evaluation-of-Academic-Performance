const router = require("express").Router();
require("../src/db/conn")
const Register = require("../src/models/registers");
const Marksheet = require("../src/models/student");
const bcrypt = require("bcryptjs");
const auth = require("../src/middleware/auth");
const authrole = require("../src/middleware/authrole");
const authDegree = require("../src/middleware/authDegree");





///////////////////// Home page Route ///////////////////////////////////
router.get("/", function(req, res) {
    res.render("index");
});

router.post("/", async function(req, res) {
    try {

        Marksheet.find({ rollNo: req.body.SearchRoll }, function(err, sdata) {
            const pass = "Pass";
            const promote = "Promote"
            let y = sdata[0].degree;
            let x = "B.tech";
            if (y == x) {
                res.status(201).render("../views/reportcard", { suser: sdata, rpass: pass, rpromote: promote })
            } else {
                res.status(201).render("../views/side", { suser: sdata, rpass: pass, rpromote: promote })
            }
            console.log(sdata);
        })

    } catch (error) {
        res.status(400).send(error);
    }
});

/////////////////////////////////////////////////////////////////////

/////////////////////Marksheet /////////////////////////
router.get("/marksheet", auth, authrole, function(req, res) {
    res.render("marksheet");
});

router.post("/marksheet", auth, authrole, async function(req, res) {
    try {
        const registerStudent = new Marksheet({
            fullName: req.body.fullName,
            rollNo: req.body.rollNo,
            uniNo: req.body.uniNo,
            batch: req.body.batch,
            branch: req.body.branch,
            degree: req.body.degree,
            github: req.body.github,
            linkedIn: req.body.linkedIn
        })
        const registered = await registerStudent.save();
        res.status(201).render("../views/index");
    } catch (error) {
        res.status(400).send(error);
    }
});
//////////////////////////// DASHBOARD ROUTE ///////////////////////////////
router.get("/dashbord", auth, authrole, function(req, res) {
    res.render("dashbord");
});
///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// ADMIN ROUTE////////////////////////
router.get("/admin", auth, authrole, async function(req, res) {
    Register.find({}, function(err, data) {
        res.render("admin", { users: data })
    })

});
//////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Registration Route//////////////
router.get("/registration", function(req, res) {
    res.render("registration");
})


router.post("/registration", async function(req, res) {
    try {
        const password = req.body.pass;
        const cpassword = req.body.cpass;
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
                gender: req.body.gender,
                pass: req.body.pass,
                cpass: req.body.cpass
            })

            const token = await registerEmployee.generateAuthToken();


            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 50000),
                httpOnly: true
            });

            const registerd = await registerEmployee.save();

            res.status(201).render("../views/login");

        } else {
            res.send("Password is not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
});
//////////////////////////////////////////////////////////////////////////

/////////////////////// Login Route ////////////////////////////////////////
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", async function(req, res) {
    try {

        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, useremail.pass);
        const token = await useremail.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + (50000 * 60)),
            httpOnly: true
        });
        if (isMatch) {
            res.status(201).render("../views/index");
        } else {
            res.send("password are not matching");
        }
    } catch (error) {
        res.status(400).send("invalid Email")
    }
});
/////////////////////////////////////////////////////////////////////////
///////////////////////////////// Logout/////////////////////////////////
router.get("/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token
        })
        res.clearCookie("jwt");
        await req.user.save();
        res.render("login")
            // console.log("logout successfully");
    } catch (error) {
        res.status(500).send(error);
    }
});
/////////////////////// Complete Logout...//////////////////////////////
router.get("/logout_all", auth, async(req, res) => {
    try {
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("index")
    } catch (error) {
        res.status(500).send(error);
    }
});
///////////////////////////////////////////////////////////////////////
/////////////////////////////about route..///////////////

router.get("/about", function(req, res) {
    res.render("about");
});
/////////////////////////////////////////////////////
//////////////////// MARKSHEET ROUTE/////////////////

router.get("/marksheet", auth, function(req, res) {
    res.render("marksheet");
});
///////////////////////////////////////////////////
////////////////////// UPDATE ROUTE ///////////////
router.get("/updateUser", auth, authrole, function(req, res) {
    res.render("updateUser");
});

router.post("/updateUser", auth, authrole, function(req, res) {
    const email = req.body.email;
    const isAdmin = req.body.isAdmin;
    Register.findOneAndUpdate({ email }, { $set: { isAdmin } }, { new: true }, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }

        console.log(doc);
    });
    res.render("updateUser");
});
//////////////////////////////////////////////////////
//////////////////Delete user ////////////////////////
router.get("/deleteUser", auth, authrole, function(req, res) {
    res.render("deleteUser");
});

router.post("/deleteUser", auth, authrole, function(req, res) {
    const email = req.body.email;
    Register.deleteOne({ email }, (err, docc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(docc);
    });
    res.render("deleteUser");
});
//////////////////////////////////////////////////////
//////////////// Delete Student////////////////////
router.get("/deleteStudent", auth, authrole, function(req, res) {
    res.render("deleteStudent");
});

router.post("/deleteStudent", auth, authrole, function(req, res) {
    const rollNo = req.body.rollNo;
    Marksheet.deleteOne({ rollNo }, (err, docc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(docc);
    });
    res.render("deleteStudent");
});
///////////////////////////////////////////////////////
///////////////updatemarks////////////////////////////
router.get("/updatemarks", auth, function(req, res) {
    res.render("updatemarks");
});

router.post("/updatemarks", auth, async function(req, res) {
    try {
        const rollNo = req.body.rollNo;
        Marksheet.findOneAndUpdate({ rollNo }, {
            $push: {
                sem: [{
                    semName: req.body.semName,
                    sub1: { sub1Name: req.body.sub1Name, sub1Int: req.body.sub1Int, sub1Ext: req.body.sub1Ext },
                    ssub1: { ssub1Name: req.body.ssub1Name, ssub1Int: req.body.ssub1Int, ssub1Ext: req.body.ssub1Ext },
                    sub1p: { sub1pName: req.body.sub1pName, sub1pInt: req.body.sub1pInt, sub1pExt: req.body.sub1pExt },
                    sub2: { sub2Name: req.body.sub2Name, sub2Int: req.body.sub2Int, sub2Ext: req.body.sub2Ext },
                    ssub2: { ssub2Name: req.body.ssub2Name, ssub2Int: req.body.ssub2Int, ssub2Ext: req.body.ssub2Ext },
                    sub2p: { sub2pName: req.body.sub2pName, sub2pInt: req.body.sub2pInt, sub2pExt: req.body.sub2pExt },
                    sub3: { sub3Name: req.body.sub3Name, sub3Int: req.body.sub3Int, sub3Ext: req.body.sub3Ext },
                    ssub3: { ssub3Name: req.body.ssub3Name, ssub3Int: req.body.ssub3Int, ssub3Ext: req.body.ssub3Ext },
                    sub3p: { sub3pName: req.body.sub3pName, sub3pInt: req.body.sub3pInt, sub3pExt: req.body.sub3pExt },
                    sub4: { sub4Name: req.body.sub4Name, sub4Int: req.body.sub4Int, sub4Ext: req.body.sub4Ext },
                    sub4p: { sub4pName: req.body.sub4pName, sub4pInt: req.body.sub4pInt, sub4pExt: req.body.sub4pExt },
                    sub5: { sub5Name: req.body.sub5Name, sub5Int: req.body.sub5Int, sub5Ext: req.body.sub5Ext },
                    sub5p: { sub5pName: req.body.sub5pName, sub5pInt: req.body.sub5pInt, sub5pExt: req.body.sub5pExt },
                    sub6: { sub6Name: req.body.sub6Name, sub6Int: req.body.sub6Int, sub6Ext: req.body.sub6Ext }
                }]
            }
        }, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            console.log(doc);
        });
        res.status(201).render("../views/index");
    } catch (error) {
        res.status(400).send(error);
    }
});


/////////////////////////////////////chart/////////////////////////////////////
router.get("/reportcard", function(req, res) {
    res.render("reportcard");
});

router.get("/side", function(req, res) {
    res.render("side");
});
/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Update Projects ///////////////////////////////

router.get("/updateProjects", auth, function(req, res) {
    res.render("updateProjects");
});
router.post("/updateProjects", auth, async function(req, res) {
    try {
        const rollNo = req.body.rollNo;
        Marksheet.findOneAndUpdate({ rollNo }, {
            $push: {
                project: [{
                    projectName: req.body.projectName,
                    projectLink: req.body.projectLink
                }]
            }
        }, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            console.log(doc);
        });
        res.status(201).render("../views/updateProjects");
    } catch (error) {
        res.status(400).send(error);
    }
});
///////////////////////////////////////////////////////////////////////////
////////////////////// Achivements ////////////////////////////////////////
router.get("/achivements", auth, function(req, res) {
    res.render("achivements");
});
router.post("/achivements", auth, async function(req, res) {
    try {
        const rollNo = req.body.rollNo;
        Marksheet.findOneAndUpdate({ rollNo }, {
            $push: {
                achivement: [{
                    achName: req.body.achName,
                    achdiscription: req.body.achdiscription
                }]
            }
        }, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            console.log(doc);
        });
        res.status(201).render("../views/achivements");
    } catch (error) {
        res.status(400).send(error);
    }
});
////////////////////////////////////////////////////
/////////Re-Update Marks////////////////////////////
router.get("/reUpdate", auth, function(req, res) {
    res.render("reUpdate");
});

router.post("/reUpdate", auth, async function(req, res) {
    try {
        const rollNo = req.body.rollNo;
        const semName = req.body.semName;
        Marksheet.findOneAndUpdate({ rollNo }, {
            $set: {
                sem: [{
                    semName: req.body.semName,
                    sub1: { sub1Namecp: req.body.sub1Namecp, sub1Name: req.body.sub1Name, sub1Int: req.body.sub1Int, sub1Ext: req.body.sub1Ext },
                    ssub1: { ssub1Name: req.body.ssub1Name, ssub1Int: req.body.ssub1Int, ssub1Ext: req.body.ssub1Ext },
                    sub1p: { sub1pNamecp: req.body.sub1pNamecp, sub1pName: req.body.sub1pName, sub1pInt: req.body.sub1pInt, sub1pExt: req.body.sub1pExt },
                    sub2: { sub2Namecp: req.body.sub2Namecp, sub2Name: req.body.sub2Name, sub2Int: req.body.sub2Int, sub2Ext: req.body.sub2Ext },
                    ssub2: { ssub2Name: req.body.ssub2Name, ssub2Int: req.body.ssub2Int, ssub2Ext: req.body.ssub2Ext },
                    sub2p: { sub2pNamecp: req.body.sub2pNamecp, sub2pName: req.body.sub2pName, sub2pInt: req.body.sub2pInt, sub2pExt: req.body.sub2pExt },
                    sub3: { sub3Namecp: req.body.sub3Namecp, sub3Name: req.body.sub3Name, sub3Int: req.body.sub3Int, sub3Ext: req.body.sub3Ext },
                    ssub3: { ssub3Name: req.body.ssub3Name, ssub3Int: req.body.ssub3Int, ssub3Ext: req.body.ssub3Ext },
                    sub3p: { sub3pNamecp: req.body.sub3pNamecp, sub3pName: req.body.sub3pName, sub3pInt: req.body.sub3pInt, sub3pExt: req.body.sub3pExt },
                    sub4: { sub4Namecp: req.body.sub4Namecp, sub4Name: req.body.sub4Name, sub4Int: req.body.sub4Int, sub4Ext: req.body.sub4Ext },
                    sub4p: { sub4pNamecp: req.body.sub4pNamecp, sub4pName: req.body.sub4pName, sub4pInt: req.body.sub4pInt, sub4pExt: req.body.sub4pExt },
                    sub5: { sub5Namecp: req.body.sub5Namecp, sub5Name: req.body.sub5Name, sub5Int: req.body.sub5Int, sub5Ext: req.body.sub5Ext },
                    sub5p: { sub5pNamecp: req.body.sub5pNamecp, sub5pName: req.body.sub5pName, sub5pInt: req.body.sub5pInt, sub5pExt: req.body.sub5pExt },
                    sub6: { sub6Namecp: req.body.sub6Namecp, sub6Name: req.body.sub6Name, sub6Int: req.body.sub6Int, sub6Ext: req.body.sub6Ext }
                }]
            }
        }, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            console.log(doc);
        });
        res.status(201).render("../views/reUpdate");
    } catch (error) {
        res.status(400).send(error);
    }
});
///////////////////////////////////////////////////
/////////////////emptyMarks////////////////////////
router.get("/emptyMarks", function(req, res) {
    res.render("emptyMarks");
});
router.post("/emptyMarks", async function(req, res) {
    try {
        const rollNo = req.body.rollNo;

        Marksheet.updateOne({
            rollNo,
        }, {
            $set: {
                sem: []
            }
        }, { new: true }, (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
            console.log(doc);
        });

        res.render("emptyMarks");
    } catch (error) {
        res.status(400).send(error);
    }

});






////////////// export all routes ///////////////////
module.exports = router;











// ,
//                     sub2: { sub2Name: rb.sub2Name },
//                     sub3: { sub3Name: rb.sub3Name },
//                     sub4: { sub4Name: rb.sub4Name },
//                     sub5: { sub5Name: rb.sub5Name },
//                     sub6: { sub6Name: rb.sub6Name }