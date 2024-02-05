const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            unique: true,
            get: (date) => prettyDate(date)
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        }
    }
);

//reactionCount virtual
userSchema.virtual('reactionCount').get(function () {
    return this.reations.length;
})

const Thought = model("Thought", thoughtSchema);

module.exports = Thought; 