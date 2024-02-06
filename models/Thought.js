const { Schema, model, Types } = require('mongoose'); 

function prettyDate(date) {
    // Create a Date object from the provided date
    const d = new Date(date);

    // Formatting
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are indexed, add 1
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');

    // Combine components
    return `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
}

const reactionSchema = new Schema({
    reactionId: {
        type: Types.ObjectId, 
        default: () => new Types.ObjectId() 
    },
    reactionBody: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: prettyDate
    }
});

const thoughtSchema = new Schema({
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
        get: prettyDate
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionSchema]
}, {
    toJSON: {
        virtuals: true,
        getters: true
    }
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
