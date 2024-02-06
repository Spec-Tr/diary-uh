const router = require('express').Router();
const { User } = require("../models");

//all users
router.get('/', (req, res) => {
    User.find().then(dbUser => {
        res.json(dbUser)
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
});

//user by id
router.get('/:id', (req, res) => {
    User.find({ _id: req.params.id }).then(dbUser => {
        if (!dbUser) {
            res.status(404).json({ msg: "Cannot find User with that ID" });
        }
        res.json({
            dbUser,
            thoughts: dbUser.thoughts,
            friends: dbUser.friends
        })
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
});

//new user
router.post("/", (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email
    }).then(newUser => {
        res.json({ msg: "User created successfully" })
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
})

// Update user
router.put("/:id", (req, res) => {
    console.log("PUT request received for user ID:", req.params.id);
    console.log("Request body:", req.body);

    User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
    ).then(updatedUser => {
        if (!updatedUser) {
            res.status(404).json({ msg: "Cannot find User with that ID" });
        } else {
            console.log("User updated:", updatedUser);
            res.json({ msg: "User updated successfully" });
        }
    }).catch(err => {
        console.error("Error updating user:", err);
        res.status(500).json({ msg: "Internal server error", err });
    });
});


//delete
router.delete("/:id", (req, res) => {
    User.findOneAndDelete({_id: req.params.id}).then(deletedUser => {
        res.json({msg: "User deleted successfully"})
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
})

//Add friend by ID
router.post('/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        {$addToSet: {friends: req.params.friendId}}
        ).then(dbUser => {
        if (!dbUser) {
            res.status(404).json({ msg: "Cannot find User with that ID" });
        } else {
            res.json({msg: `Friend added successfully`})
        }
        
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
});

//Delete friend by ID
router.delete('/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        {$pull: {friends: req.params.friendId}}
        ).then(dbUser => {
        if (!dbUser) {
            res.status(404).json({ msg: "Cannot find User with that ID" });
        } else {
            res.json({msg: `User unfriended successfully`})
        }
        
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
});


module.exports = router;