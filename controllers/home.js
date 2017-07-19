const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Category = mongoose.model('Category');
const Tag = mongoose.model('Tag');





module.exports = {



    index: (req, res) => {
        Category.find({}).then(categories => {
            res.render('home/index', {categories: categories});



        });


    },

    errPage:(req,res)=>{
        res.render('problem123/problem123')
    },

    listCategoryArticles: (req, res) => {
        let id = req.params.id;

       if(!req.isAuthenticated()){
           res.redirect('/')
           return
       }

        Category.findById(id).populate('articles').then(category => {
            User.populate(category.articles, {path: 'author'}, (err) => {
                if (err) {
                    console.log(err.message);
                }

                Tag.populate(category.articles, {path: 'tags'}, (err) => {
                   if (err) {
                       console.log(err.message);
                   }
                });

                res.render('home/article', {articles: category.articles});
            });
        });
    },

};