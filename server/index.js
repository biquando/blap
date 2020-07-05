const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

// Load .env environment variables into process.env
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Sets up mongoose connection to atlas
const uri = process.env.ATLAS_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

const connection = mongoose.connection
connection.once("open", () => {
    console.log("Connected to MongoDB database")
})

// Set up the api routes
const usersRoute = require("./routes/users.route")
const authRoute = require("./routes/auth.route")
const postsRoute = require("./routes/posts.route")
app.use("/api/users", usersRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postsRoute)

const path = require("path")
app.use(express.static(path.join(__dirname, "..", "build")))
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"))
})

// Starts the server on port
app.listen(port, () => {
    console.log("Server is running on port: " + port)
})
