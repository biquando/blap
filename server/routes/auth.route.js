const router = require("express").Router()
const User = require("../models/User.model")
const Post = require("../models/Post.model")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

// Log in a username/password
router.route("/login").post((req, res) => {
    const username = req.body.username
    const password = req.body.password

    User.findOne({ username }, function (err, user) {
        if (err) throw err

        if (user === null) {
            res.status(400).json({ msg: "User not found" })
        } else {
            user.comparePassword(password, function (err, isMatch) {
                if (err) throw err
                if (isMatch) {
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
                } else {
                    res.status(401).json({ msg: "Invalid password" })
                }
            })
        }
    })
})

// Delete a user with a token
router.route("/delete").delete(auth, (req, res) => {
    User.findById(req.user.id)
        .select("-password")
        .then(user => {
            if (user === null) {
                return res.status(404).json({ msg: "User not found" })
            }
            const username = user.username

            // Delete the user
            User.findOneAndDelete({ username }, err => {
                if (err) throw err

                // Remove the user from other people's following lists
                User.find()
                    .select("following")
                    .then(users => {
                        users.map(user => {
                            user.following = user.following.filter(
                                follow => follow !== username
                            )
                            user.save()
                        })
                    })
            })

            // Delete the user's posts
            Post.deleteMany({ username }, err => {
                if (err) throw err
            })

            res.json({
                msg: "Deleted user",
                user: {
                    id: user.id,
                    username: user.username,
                },
            })
        })
})

// Gets a user based on a token
router.route("/user").get(auth, (req, res) => {
    User.findById(req.user.id)
        .select("-password")
        .then(user => res.json(user))
})

// Follow a target user
router.route("/follow").patch(auth, (req, res) => {
    User.findById(req.user.id)
        .select("-password")
        .then(user => {
            if (user === null) {
                return res.status(404).json({ msg: "User not found" })
            }
            const { username } = user
            const targetUsername = req.body.user

            if (username === targetUsername) {
                return res
                    .status(400)
                    .json({ msg: "User and target are the same" })
            }

            if (user.following.includes(targetUsername)) {
                return res.status(400).json({ msg: "Already following target" })
            }

            User.findOne({ username: targetUsername }, (err, targetUser) => {
                if (err) throw err
                if (targetUser === null) {
                    return res.status(404).json({ msg: "Target is not a user" })
                }

                const newFollowing = user.following.concat([targetUsername])
                User.findByIdAndUpdate(user.id, {
                    following: newFollowing,
                }).then(oldUser =>
                    res.json({
                        following: newFollowing,
                    })
                )
            })
        })
})

// Unfollow a target user
router.route("/unfollow").patch(auth, (req, res) => {
    User.findById(req.user.id)
        .select("-password")
        .then(user => {
            if (user === null) {
                return res.status(404).json({ msg: "User not found" })
            }
            const targetUsername = req.body.user

            if (!user.following.includes(targetUsername)) {
                return res.status(400).json({ msg: "Not following target" })
            }

            const newFollowing = user.following.filter(
                name => name !== targetUsername
            )
            User.findByIdAndUpdate(user.id, {
                following: newFollowing,
            }).then(() =>
                res.json({
                    following: newFollowing,
                })
            )
        })
})

// Get a user's following list
router.route("/following").get(auth, (req, res) => {
    User.findById(req.user.id)
        .select("following")
        .then(user => {
            if (user === null) {
                return res.status(404).json({ msg: "User not found" })
            }

            res.json({ following: user.following })
        })
})

module.exports = router
