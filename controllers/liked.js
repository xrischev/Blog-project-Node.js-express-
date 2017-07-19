const Article = require('mongoose').model('Article');
const Comment= require('mongoose').model('CommentArticle');
const User=require('mongoose').model('User');
const Liked=require('mongoose').model('Liked');


module.exports={
    getLikes:(req,res)=>{

        let commentId=req.params.id

        Comment.findById(commentId).then(comment=>{

            let articleId=comment.article
            let userId=req.user.id;


                User.findById(userId).then(user=>{

                    let inSide=false


                    for(let a=0;a<=user.liked.length-1;a++){
                        if(user.liked[a].equals(comment._id)){
                            inSide=true


                        }
                    }

                    if(inSide){
                        res.redirect(`/article/details/${articleId}`)
                        return;
                    }
                    else{

                        let liked={
                            author:userId,
                            article:articleId,
                            comment:commentId,
                        }
                        Liked.create(liked).then(liked=>{

                        })


                        let likes=comment.likes+1
                        user.liked.push(commentId)
                        user.save()

                        Comment.update({_id:commentId},{$set:{likes:likes}}).then(update=>{

                            res.redirect(`/article/details/${articleId}`)
                        })

                    }

                })


        })
    },


}

