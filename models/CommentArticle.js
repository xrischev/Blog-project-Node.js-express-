const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    content: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, required: true },
    likes:{type:Number,default:0},
    date: { type:String}
});

commentSchema.method({
    prepareInsert: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            user.articles.push(this.id);
            user.save();
        });




    },
    prepareDelete: function () {
        let User = mongoose.model('User');
        User.findById(this.author).then(user => {
            if (user) {
                user.coment.remove(this.id);
                user.save();
            }

            let Article = mongoose.model('Article');
            Article.findById(this.article).then(article=>{
                if(article){
                    console.log(article)
                    article.coment.remove(this.id)
                    article.save()
                }

            })

        });





    },
});



const Comment = mongoose.model('CommentArticle', commentSchema);

module.exports = Comment;
