const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastAccessed: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const handleError = (err) => console.error(err);

User.find({})
    .exec()
    .then(collection => {
        if(collection.length === 0) {
            User
            .insertMany(
                [
                    { username: "tman", email: "t@man.com", thoughts: [], friends: []},
                    { username: "bob", email: "bob@bob.com", thoughts: [], friends: []},
                    { username: "jen", email: "jen@jen.com", thoughts: [], friends: []},
                ]
            )
            .catch(err => handleError(err));
        }
    });

    module.exports = User; 