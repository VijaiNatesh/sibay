const express = require("express")
const dotenv = require("dotenv").config()
const cors = require("cors")

const mongoose = require("mongoose")
mongoose.set('strictQuery', true);
const userRoute = require("./routes/userRoute")
//const fileRoute = require("./routes/fileRoute")
//const blogRoute = require("./routes/blogRoute")

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
   useUnifiedTopology: true
}, ()=> {
    console.log("DB Connected")
})


const app = express()
app.use(cors())

app.use(express.json())
app.get('/', async(req, res) => {
   await res.send("Backend of trainig website")
})
app.use('/', userRoute)
//app.use('/', fileRoute)
//app.use('/blog', blogRoute)

const port = 8000 || process.env.port;


app.listen(port, () => {
    console.log("Server Up")
})