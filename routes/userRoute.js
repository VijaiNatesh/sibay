const express = require('express')
const User = require('../model/User')
const sha256 = require("js-sha256")
const otpGenerator = require("otp-generator")
const Otp = require('../model/Otp')
const twilio = require("twilio")
const sendSms = require("../sms")




const userRoute = express.Router()

userRoute.post('/signup', async (req, res) => {
    try {

        const { first_name, last_name, email, passwd, contact_no } = req.body
        const user = await User.findOne({ email })
        if (user) throw "User already register"
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            passwd: sha256(passwd + process.env.SALT),
            contact_no
        })
        res.json({
            message: "User " + first_name + " is registered"
        })
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

userRoute.post('/login', async (req, res) => {
    try {
        const { contact_no, passwd } = req.body
        const user = await User.findOne({
            contact_no,
            passwd: sha256(passwd + process.env.SALT)
        })
        if (!user) throw "Invalid credentials"
        res.json({
            user: user,
            message: "User Logged In"
        })
    }
    catch (err) {
        res.json({
            message: err
        })
    }
})

userRoute.post('/forgotpassword', async (req, res) => {
    try {
        const { contact_no } = req.body;
        const user = await User.findOne({ contact_no })
        if (!user) throw "User not registered"
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true })
        const newOtp = await Otp.create({
            contact_no,
            otp
        })
        console.log(newOtp.otp)
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        client.messages
            .create({
                body: newOtp.otp,
                to: `+91${contact_no}`, // Text this number
                from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
            })
            .then((message) => console.log(message))
            .catch((err) => console.log(err));
        res.json({
            message: "Otp sent to registered mobile number"
        })
    }
    catch (err) {
        res.json({
            message: err
        })
    }



})

userRoute.post("/verifyotp", async (req, res) => {
    try {
        const { otp, contact_no } = req.body;
        const otpData = await Otp.findOne({
            otp, contact_no
        })
        if (otpData)
            await Otp.deleteOne({ otp })
        if (!otpData) throw "Otp doesn't match"
        res.json({
            message: "Otp Matching"
        })
  }
  catch(err){
    res.json({
        meassage: err
    })
  }    
})

module.exports = userRoute;