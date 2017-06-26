const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// YOUR DATABASE
mongoose.connect(process.env.DATABASE);


const todoSchema = mongoose.Schema({
    text: String,
    completed: Boolean,
    created_At: String
})



module.exports = mongoose.model("Todo", todoSchema)