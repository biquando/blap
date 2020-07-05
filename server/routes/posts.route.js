const router = require("express").Router()
const Post = require("../models/Post.model")
const User = require("../models/User.model")
const auth = require("../middleware/auth")

// Get an array of all posts
router.route("/all").get((req, res) => {
    Post.find()
        .select("-content")
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json(err))
})

// Create a new post
router.route("/create").post(auth, (req, res) => {
    const title = req.body.title
    const content = req.body.content

    try {
        if (
            content.blocks.length < 2 ||
            content.blocks[0].type !== "header" ||
            content.blocks[0].data.level !== 1 ||
            title !== content.blocks[0].data.text
        ) {
            return res.status(400).json(err)
        }
    } catch (err) {
        return res.status(400).json(err)
    }

    User.findById(req.user.id)
        .select("-password")
        .then(user => {
            if (user === null) {
                return res.status(404).json({ msg: "User not found" })
            }

            const newPost = new Post({
                username: user.username,
                title,
                content,
            })

            newPost
                .save()
                .then(post => res.json({ post }))
                .catch(err => res.status(400).json(err))
        })
})

// Get a post based on id
router.route("/id/:id").get((req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err || post === null) {
            return res.status(404).json({ msg: "Post not found" })
        }
        res.json(post)
    })
})

// Delete a post
router.route("/id/:id").delete(auth, (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if (err || post === null) {
            return res.status(404).json({ msg: "Post not found" })
        }

        User.findById(req.user.id)
            .select("-password")
            .then(user => {
                if (user === null) {
                    return res.status(404).json({ msg: "User not found" })
                }

                // Checks if the token username and the post's username are the same
                if (user.username.localeCompare(post.username) === 0) {
                    Post.findByIdAndDelete(req.params.id).then(() =>
                        res.json({
                            msg: "Deleted post",
                            post,
                        })
                    )
                } else {
                    res.status(401).json({
                        msg: "Failed to delete post: Invalid token",
                    })
                }
            })
            .catch(err => res.status(400).json(err))
    })
})

// Edit a post
router.route("/id/:id").patch(auth, (req, res) => {
    const newContent = req.body.content

    Post.findById(req.params.id, (err, post) => {
        if (err || post === null) {
            return res.status(404).json({ msg: "Post not found" })
        }

        try {
            if (
                newContent.blocks.length < 2 ||
                newContent.blocks[0].type !== "header" ||
                newContent.blocks[0].data.level !== 1 ||
                post.title !== newContent.blocks[0].data.text
            ) {
                return res.status(400).json({ msg: "Post did not meet reqs" })
            }
        } catch (err) {
            return res
                .status(400)
                .json({ msg: "ERROR: Post did not meet reqs" })
        }

        User.findById(req.user.id)
            .select("-password")
            .then(user => {
                if (user === null) {
                    return res
                        .status(400)
                        .json({ msg: "Cannot find user associated with token" })
                }

                // Checks if the token username and the post's username are the same
                if (user.username === post.username) {
                    Post.findByIdAndUpdate(req.params.id, {
                        content: newContent,
                    }).then(oldPost => res.json({ oldPost }))
                } else {
                    res.status(401).json({
                        msg: "Failed to edit post: Invalid token",
                    })
                }
            })
            .catch(err => res.status(400).json(err))
    })
})

// Get an array of posts based on a following list
router.route("/following").get(auth, (req, res) => {
    User.findById(req.user.id)
        .select("-password")
        .then(user => {
            if (user === null) {
                return res.status(404).json({ msg: "User not found" })
            }

            const { following } = user
            if (following.length === 0) {
                Post.find()
                    .select("-content")
                    .then(posts => res.json({ posts, noFollowing: true }))
                    .catch(err => res.status(400).json(err))
            } else {
                const followingPosts = []
                return findPost(followingPosts, 0, following, res)
            }
        })
})
function findPost(followingPosts, idx, following, res) {
    Post.find({ username: following[idx] })
        .select("-content")
        .then(posts => {
            posts.forEach(post => {
                followingPosts.push(post)
            })

            // At the last followed user
            if (idx === following.length - 1) {
                return res.json({
                    posts: followingPosts,
                    noFollowing: false,
                })
            } else {
                return findPost(followingPosts, idx + 1, following, res)
            }
        })
}

module.exports = router
