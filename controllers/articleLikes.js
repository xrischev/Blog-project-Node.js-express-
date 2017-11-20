const Article = require('mongoose').model('Article');
const ArticleLikes=require('mongoose').model('ArticleLikes');



module.exports= {
    getLikes: (req, res) => {
        let idArticle = req.params.id;
        let articleAuthor = req.user._id



        let articleLikesObj = {
            author: articleAuthor,
            article: idArticle,
        }

        Article.findById({_id:idArticle}).then(article=>{
            let catecoryId=article.category


            ArticleLikes.find({'article':idArticle}).find({'author':articleAuthor}).then(like=>{
                if(like==''){
                    ArticleLikes.create(articleLikesObj).then(articleLikes => {


                        ArticleLikes.findById({_id:articleLikes._id}).populate('author').then(articleByAuthor=>{
                            Article.findById(idArticle).then(article => {


                                req.flash('info', 'Message : You liked this article!');

                                article.likes.push(articleLikes._id)
                                article.save()
                                res.redirect(`/category/${catecoryId}`)
                            })
                        })
                    })

                }
                else{
                    req.flash('info', 'Message : You are liked this article before!');
                    res.redirect(`/category/${catecoryId}`)
                }

            })
        })
    },

    getLookLikes:(req,res)=>{
        let idArticle=req.params.id



        ArticleLikes.find({'article':idArticle}).populate('author').then(likesByAuthor=>{


            res.render('article/likes',{likesByAuthor:likesByAuthor})
        })
    }




}