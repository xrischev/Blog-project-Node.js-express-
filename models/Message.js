const mongoose = require('mongoose');

let messageSchema = mongoose.Schema({
    content: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    sendToUser:{type: mongoose.Schema.Types.ObjectId, required: true,ref:'User'},
    date: { type:String}
});


const Message = mongoose.model('Message', messageSchema);

module.exports = Message;