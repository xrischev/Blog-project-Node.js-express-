const mongoose = require('mongoose');

let articleLikesSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, required: true ,ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const ArticleLikes = mongoose.model('ArticleLikes', articleLikesSchema);

module.exports = ArticleLikes;