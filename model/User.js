const mongoose = require('mongoose')
const conn = mongoose.createConnection(process.env.MONGO_URL)

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwd: {
        type: String,
        required: true
    },
    contact_no:{
        type: String,
        required: true
    }
})

const User = conn.model("User", userSchema)
module.exports = User;