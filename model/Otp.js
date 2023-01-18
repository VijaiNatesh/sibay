const mongoose = require("mongoose")
const conn = mongoose.createConnection(process.env.MONGO_URL)

const otpSchema = new mongoose.Schema({
    contact_no: {
        type: String,
        required: true
    },
    otp: {
        type: Number
    },
    expiresAt: {
        type: Date,
        expires: "60s",
        default: Date.now
    }
})

// otpSchema.index({createdAt: 1},{expireAfterSeconds: 10});
// otpSchema.plugin(ttl, {ttl: 500})

const Otp = conn.model("Otp", otpSchema)
module.exports = Otp;