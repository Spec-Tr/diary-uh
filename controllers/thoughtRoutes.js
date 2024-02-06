const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); 
const {Thought, User} = require("../models");

//get all thoughts
router.get('/', (req, res) => {
    Thought.find().then(dbThought => {
        console.log(dbThought); 
        res.json(dbThought);
    }).catch(err => {
        console.error("error fetching thoughts", err);
        res.status(500).json({ msg: "Internal server error", err });
    });
});


//Get thought by ID
router.get('/:id', (req, res) => {
    Thought.find({ _id: req.params.id }).then(dbThought => {
        if (!dbThought) {
            res.status(404).json({ msg: "Cannot find thought with matching ID" });
        }
        res.json({ dbThought })
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
});

// New thought
router.post("/", (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.body.userId)
    Thought.create({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
        userId: userId
    }).then(newThought => {
        return User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { thoughts: newThought._id } },
            { new: true}
        )
    }).then(dbUser => {
        if (!dbUser) {
            res.status(404).json({ msg: "Cannot find user with matching ID" })
        } else {
            res.json({ msg: "Thought created successfully" })
        }
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
})

//update thought
router.put("/:id", (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body},
        { new: true }
        ).then(updatedThought => {
            if (!updatedThought) {
                res.status(404).json({ msg: "Cannot find user with matching ID" });
            } else {
                res.json({ msg: "Thought updated successfully" })
            }
        }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
})

//delete thought by id
router.delete("/:id", (req, res) => {
    Thought.findOneAndDelete({_id: req.params.id}).then(deletedThought => {
        res.json({msg: "Thought deleted successfully"})
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
})

// New reaction
router.post("/:thoughtId/reactions", (req, res) => {
    console.log("Thought ID:", req.params.thoughtId);
    console.log("Request Body:", req.body);
    const newReaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username
    };

    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: newReaction } },
        { new: true, runValidators: true }
    ).then(updatedThought => {
        if (!updatedThought) {
            return res.status(404).json({ msg: "No thought found with this ID" });
        }
        res.json({ msg: "Reaction added successfully", updatedThought });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ msg: "Internal server error", err });
    });
});

router.get('/:thoughtId/details', (req, res) => {
    Thought.findById(req.params.thoughtId)
        .then(thought => {
            if (!thought) {
                return res.status(404).json({ msg: "Thought not found" });
            }
            console.log(thought); 
            res.json(thought); 
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ msg: "Internal server error", err });
        });
});


router.delete("/:thoughtId/reactions/:reactionId", (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } }, 
        { new: true }
    ).then(updatedThought => {
        if (!updatedThought) {
            return res.status(404).json({ msg: "No thought found with this ID or reaction not found" });
        }
        res.json({ msg: "Reaction removed successfully", updatedThought });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ msg: "Internal server error", err });
    });
});



module.exports = router;