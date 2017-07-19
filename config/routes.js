const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const adminController = require('./../controllers/admin/admin')
const articleController = require('./../controllers/article');
const tagController = require('./../controllers/tag');
const commentController=require('./../controllers/comment')
const likedController=require('./../controllers/liked')
const articleLikes=require('./../controllers/articleLikes')


module.exports = (app) => {




    app.get('/', homeController.index);
    app.get('/category/:id', homeController.listCategoryArticles);

    app.get('/problem123/problem123',homeController.errPage)

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);


    app.get('/user/message',userController.getUsers)
    app.get('/user/sendMessage/:id',userController.getMessage)

    app.get('/user/readMessages',userController.readMesseges)

    app.post('/user/sendMessage/:id',userController.postMessage)


    app.post('/user/messageFromUser',userController.messageFromUser)

    app.get('/message/delete/:id',userController.deleteMessage)
    app.get('/message/answer/:id',userController.answerMessage)




    app.post('/user/findUser',userController.findUser)

    app.get('/user/details',userController.userDetails)




    app.get('/article/create', articleController.createGet);
    app.post('/article/create', articleController.createPost);

    app.get('/article/details/:id', articleController.details);

    app.get('/article/edit/:id', articleController.editGet);
    app.post('/article/edit/:id', articleController.editPost);

    app.get('/article/delete/:id', articleController.deleteGet);
    app.post('/article/delete/:id', articleController.deletePost);

    app.get('/article/delete/:id', articleController.deleteGet);
    app.post('/article/delete/:id', articleController.deletePost);


    app.post('/article/comments/create/:id', commentController.postComment);

    app.get('/article/likes/:id',articleLikes.getLikes);
    app.get('/article/look/likes/:id',articleLikes.getLookLikes);




    app.get('/liked/likes/:id',likedController.getLikes)

    app.get('/upload',userController.getPicture);

    app.post('/upload', userController.postPicture);



    app.get('/comment/delete/:id', commentController.deleteGet);
    app.post('/comment/delete/:id', commentController.deletePost);



    app.get('/comment/edit/:id', commentController.editGetComment);
    app.post('/comment/edit/:id', commentController.editPostComment);


    app.get('/comment/readComment/:id', commentController.readComment);


    app.get('/tag/:name', tagController.listArticlesByTag);

    app.use((req, res, next ) => {
        if (req.isAuthenticated()) {
            req.user.isInRole('Admin').then(isAdmin => {
                if (isAdmin) {
                    next();
                } else {
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/user/login');
        }
    });



    app.get('/admin/user/all', adminController.user.all);

    app.get('/admin/user/edit/:id', adminController.user.editGet);
    app.post('/admin/user/edit/:id', adminController.user.editPost);

    app.get('/admin/user/delete/:id', adminController.user.deleteGet);
    app.post('/admin/user/delete/:id', adminController.user.deletePost);

    app.get('/admin/category/all', adminController.category.all);
    app.get('/admin/category/create', adminController.category.createGet);
    app.post('/admin/category/create', adminController.category.createPost);

    app.get('/admin/category/edit/:id', adminController.category.editGet);
    app.post('/admin/category/edit/:id', adminController.category.editPost);

    app.get('/admin/category/delete/:id', adminController.category.deleteGet);
    app.post('/admin/category/delete/:id', adminController.category.deletePost);
};

