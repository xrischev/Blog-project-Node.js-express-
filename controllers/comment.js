const Article = require('mongoose').model('Article');
const Comment= require('mongoose').model('CommentArticle');
const User=require('mongoose').model('User');
const Liked=require('mongoose').model('Liked')

module.exports={
    postComment:(req, res)=>{
        let id = req.params.id;
        let articleArgsContent = req.body.content;
        let user=req.user._id


        var d = new Date();
        var n = d.toString();

        let dateNow=n.substr(0,24)



        let comment={
            content:articleArgsContent,
            author:user,
            article:id,
            date:dateNow
        }




        Comment.create(comment).then(comments=>{
            Article.findById(id).populate('coments').then(article =>{
                article.comment.push(comments._id)
                article.save()
            })
            User.findById(user).populate('coments').then(user =>{
                user.comment.push(comments._id)
                user.save()
            })

            req.flash('info', 'Message : You created comment!');

            res.redirect(`/article/details/${id}`)
        })
    },
    deleteGet:(req,res)=>{

        let id = req.params.id;

        Comment.findById(id).then(content=>{

                req.user.isInRole('Admin').then(isAdmin => {
                    if (!isAdmin && !req.user.isAuthor(content)) {
                        res.redirect('/');
                        return;
                    }

                })

            res.render('comment/delete', content);
        })
    },
    deletePost:(req,res)=>{
        let id = req.params.id;




        if (!req.isAuthenticated()) {
            let returnUrl = `/comment/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }



            Comment.findById(id).then(article=> {
                let articleId = article.article

                Comment.findOneAndRemove({_id: id}).populate('author').then(comment => {
                    comment.prepareDelete();



                    res.redirect(`/article/details/${articleId}`)
                })
            })

        Liked.find({'comment':id}).then(liked=>{
            req.flash('info', 'Message : You deleted this comment!');

            for(let like of liked){
                Liked.findById({_id:like._id}).remove().then(liked1=>{
                })
            }
        })
    },
    editGetComment:(req,res)=>{
        let id=req.params.id

        Comment.findById(id).then(comment=>{
           res.render('comment/edit',comment)
        })
    },
    editPostComment:(req,res)=>{
        let id=req.params.id

        Comment.findById(id).then(article=>{
           let articleId=article.article

            let commentContent=req.body

            Comment.update({_id:id},{$set:{content:commentContent.content}}).then(update=>{
                req.flash('info', 'Message : You edited this comment!');
                res.redirect(`/article/details/${articleId}`)
            })
        })
    },
    readComment:(req,res)=>{
        let id=req.params.id

        if (!req.isAuthenticated()) {
            res.redirect('/problem123/problem123');
            return;
        }
        Comment.findById(id).then(comment=>{
            let authorComment=comment.author

           let userReg=req.user._id

            req.user.isInRole('Admin').then(isAdmin => {

                let isAuthorComment=false

                if(authorComment.equals(userReg)||isAdmin){
                    isAuthorComment=true
                }


                res.render('comment/readmore', {comment:comment,isAuthorComment:isAuthorComment})



            })



        })
    },




    }
