

router.get('/', (req, res) => {
    Thought.find().then(dbThought => {
        res.json(dbThought)
    }).catch(err => {
        console.error("error fetching thoughts", err)
        res.status(500).json({ msg: "Internal server error", err })
    })
});

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

router.delete("/:id", (req, res) => {
    Thought.findOneAndDelete({_id: req.params.id}).then(deletedThought => {
        res.json({msg: "Thought deleted successfully"})
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
})

router.post("/:thoughtId/reactions", (req, res) => {
    const newReaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username
    }
    Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$addToSet: {reactions: newReaction}},
        {new: true}
    ).then(newReaction => {
        res.json({msg: "Reaction added successfully"})
    }).catch(err => {
        console.error(err)
        res.status(500).json({ msg: "Internal server error", err })
    })
})

router.delete("/:thoughtId/reactions", (req, res) => {
    const reactionId = new mongoose.Types.ObjectId(req.body.reactionId)
    Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$pull: {reactions: {reactionId: reactionId}}}
    ).then(newReaction => {
        res.json({msg: "Reaction removed successfuly"})
    }).catch(err => {
        console.error(err)
        res.status(500).json({ msg: "Internal server error", err })
    })
})

module.exports = router;