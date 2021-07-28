// DataBase connection 

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("connection successful");
}).catch((e) => {
    console.log("no connection");
})


//.......