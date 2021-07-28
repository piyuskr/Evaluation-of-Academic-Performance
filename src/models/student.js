const mongoose = require("mongoose");

const studentmarkSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        unique: true,
        required: true
    },
    uniNo: {
        type: String,
        unique: true,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    github: {
        type: String,
        unique: true,
        required: true
    },
    linkedIn: {
        type: String,
        unique: true,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    project: [{
        projectName: String,
        projectLink: String
    }],
    achivement: [{
        achName: String,
        achdiscription: String
    }],
    sem: [{
        semName: String,
        sub1: {
            sub1Name: String,
            sub1Int: Number,
            sub1Ext: Number
        },
        ssub1: {
            ssub1Name: String,
            ssub1Int: Number,
            ssub1Ext: Number
        },
        sub1p: {
            sub1pName: String,
            sub1pInt: Number,
            sub1pExt: Number
        },
        sub2: {
            sub2Name: String,
            sub2Int: Number,
            sub2Ext: Number
        },
        ssub2: {
            ssub2Name: String,
            ssub2Int: Number,
            ssub2Ext: Number
        },
        sub2p: {
            sub2pName: String,
            sub2pInt: Number,
            sub2pExt: Number
        },
        sub3: {
            sub3Name: String,
            sub3Int: Number,
            sub3Ext: Number
        },
        ssub3: {
            ssub3Name: String,
            ssub3Int: Number,
            ssub3Ext: Number
        },
        sub3p: {
            sub3pName: String,
            sub3pInt: Number,
            sub3pExt: Number
        },
        sub4: {
            sub4Name: String,
            sub4Int: Number,
            sub4Ext: Number
        },
        sub4p: {
            sub4pName: String,
            sub4pInt: Number,
            sub4pExt: Number
        },
        sub5: {
            sub5Name: String,
            sub5Int: Number,
            sub5Ext: Number
        },
        sub5p: {
            sub5pName: String,
            sub5pInt: Number,
            sub5pExt: Number
        },
        sub6: {
            sub6Name: String,
            sub6Int: Number,
            sub6Ext: Number
        }
    }]
})







// need to create a Collection

const Marksheet = new mongoose.model("Marksheet", studentmarkSchema);

module.exports = Marksheet;