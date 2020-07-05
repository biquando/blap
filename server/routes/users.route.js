const router = require("express").Router()
const User = require("../models/User.model")
const Post = require("../models/Post.model")
require("dotenv").config()
const jwt = require("jsonwebtoken")

// Gets an array of all users
router.route("/").get((req, res) => {
    User.find()
        .select("-password")
        .then(users => res.json(users))
        .catch(err => res.status(400).json(err))
})

// Sign up a new user
router.route("/signup").post((req, res) => {
    const username = req.body.username
    const password = req.body.password

    // Check the inputted username and password

    const usernameRegex = /^[a-zA-Z0-9_]*$/
    if (
        !usernameRegex.test(username) ||
        username.length < 3 ||
        username.length > 20
    ) {
        const invalidMsg = "Username must be 3–20 characters [a–z, 0–9, _]"
        return res.status(400).json({ msg: invalidMsg })
    }

    if (password.length < 6) {
        const invalidMsg = "Password must be at least 6 characters"
        return res.status(400).json({ msg: invalidMsg })
    }

    // Create the new user

    const newUser = new User({
        username,
        password,
    })

    newUser
        .save()
        .then(user => {
            jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: 86400 },
                (err, token) => {
                    if (err) throw err
                    res.json({
                        token,
                        user: {
                            id: user.id,
                            username: user.username,
                        },
                    })
                }
            )
        })
        .catch(err =>
            res.status(400).json({ msg: "Username is already in use" })
        )
})

// Get all of a user's posts
router.route("/:username/posts").get((req, res) => {
    Post.find({ username: req.params.username }, (err, posts) => {
        if (err) throw err
        if (posts.length === 0) {
            User.findOne({ username: req.params.username }, (err, user) => {
                if (err) throw err
                if (user === null) {
                    res.status(404).json({ msg: "User not found" })
                } else {
                    res.json([])
                }
            })
        } else {
            res.json(posts)
        }
    }).select("-content")
})

module.exports = router
