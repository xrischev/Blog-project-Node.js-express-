const mongoose = require('mongoose');

let likedSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    article: { type: mongoose.Schema.Types.ObjectId, required: true },
    comment: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Liked = mongoose.model('Liked', likedSchema);

module.exports = Liked;
