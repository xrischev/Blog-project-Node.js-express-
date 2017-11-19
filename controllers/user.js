const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');
const Message=require('mongoose').model('Message')
const formidable = require('formidable');

const encryption = require('./../utilities/encryption');



module.exports = {
    registerGet: (req, res) => {


        res.render('user/register');
    },

    registerPost: (req, res) => {
        let registerArgs = req.body;

        User.findOne({email: registerArgs.email}).then(user => {
            let errorMsg = '';
            if (user) {
                errorMsg = 'User with the same username exists!';
            } else if (registerArgs.password !== registerArgs.repeatedPassword) {
                errorMsg = 'Passwords do not match!'
            }

            if (errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', registerArgs)
            } else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);

                let userObject = {
                    email: registerArgs.email,
                    passwordHash: passwordHash,
                    fullName: registerArgs.fullName,
                    avatar:'',
                    salt: salt
                };

                let roles = [];
                Role.findOne({name: 'User'}).then(role => {
                    roles.push(role.id);

                    userObject.roles = roles;
                    User.create(userObject).then(user => {
                        user.prepareInsert()
                        req.logIn(user, (err) => {
                            if (err) {
                                registerArgs.error = err.message;
                                res.redirect('user/register', registerArgs);
                                return;
                            }

                            req.flash('info', 'vie ste registriran');
                            res.redirect('/');
                        })

                    });
                });
            }
        });
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;
        User.findOne({email: loginArgs.email}).then(user => {
            if (!user || !user.authenticate(loginArgs.password)) {
                let errorMsg = 'Either username or password is invalid!';
                loginArgs.error = errorMsg;
                res.render('user/login', loginArgs);
                return;
            }

            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/user/login', {error: err.message});
                    return;
                }

                let returnUrl = '/';
                if (req.session.returnUrl) {
                    returnUrl = req.session.returnUrl;
                    delete req.session.returnUrl;
                }

                loginArgs.errorasdf='error from outsude'

                var flash = require('express-flash')


                req.flash('info', 'vie ste loognat');
                res.redirect(returnUrl);


            })
        })
    },

    logout: (req, res) => {

        req.flash('info', 'vie ste logout');
        req.logOut();
        res.redirect('/');
    },

    getUsers:(req,res)=>{

        User.find({}).then(users=>{
            res.render('user/message/message',{users: users})
        })
    },
    getMessage:(req,res)=>{

        let userId=req.params.id

        User.findById(userId).then(user=>{


            res.render('user/message/sendMassage',{user:user})
        })


    },
    postMessage:(req,res)=>{

        var d = new Date();
        var n = d.toString();

        let dateNow=n.substr(0,24)

        let logUser=req.user._id
        let userId=req.params.id
        let messageContent=req.body.content

        let message={
            content:messageContent,
            author:logUser,
            sendToUser:userId,
            date:dateNow

        }

        Message.create(message).then(message=>{
            console.log(message)
            User.findById(userId).populate('messeges').then(user=>{



                user.message.push(message._id)
                user.save()

                res.redirect('/user/message')
            })
        })


    },

    readMesseges:(req,res)=>{

        let logUser=req.user._id





        Message.find({'sendToUser':logUser}).populate('author').then(message=>{

            let noMessage;

          if(message==""){
              res.render('user/message/readMessages',{message:message,noMessage:true})

          }
          else{
              res.render('user/message/readMessages',{message:message,noMessage:false})
          }

        })

    },
    deleteMessage:(req,res)=>{
      let messageId=req.params.id
        let authorMessage=req.user._id



        Message.findOneAndRemove({_id: messageId}).then(deleteMessage=>{
            res.redirect('/user/readMessages')
        })


        User.findById(authorMessage).then(user => {
            if (user) {
                user.message.remove(messageId);
                user.save();
            }
        });

    },
    answerMessage:(req,res)=>{
        let messageId=req.params.id
        Message.findById(messageId).populate('author').then(message=>{

            res.render('user/message/answerMesssage',{message:message})
        })
    },
    messageFromUser:(req,res)=>{
        let findUser=req.body.nameUser

        User.find({'fullName':findUser}).then(user=>{


           if(user==''){

               res.redirect('/user/readMessages')
           }
           else{

               let userId=user[0]._id

               Message.find({'author':userId}).populate('author').then(message=>{

                   let noMessage;

                   if(message==""){
                       res.render('user/message/readMessages',{message:message,noMessage:true})

                   }
                   else{
                       res.render('user/message/readMessages',{message:message,noMessage:false})
                   }
               })
           }

        })
    },

    userDetails:(req,res)=>{

        let logUser=req.user._id


        User.findById(logUser).then(user=>{
            console.log(user)
            res.render('user/details',{user:user})
        })


    },
    findUser:(req,res)=>{
        let findByEmail=req.body.content


        User.find({'email':findByEmail}).then(user=>{
            console.log(user)
            res.render('user/message/message',{users: user})
        })
    },

    getPicture:(req,res)=> {
        res.sendFile(__dirname + '/index.html');
    },
    postPicture:(req,res)=>{

        let user=req.user._id

        User.findById(user).then(user=>{
            let userEmails=user.email+'-avatar'

            var form = new formidable.IncomingForm();

            form.parse(req);

            form.on('fileBegin', function (name, file){
                file.path =  './public/uploads/' + userEmails+'.jpg';
            });

            form.on('file', function (name, file){
                console.log('Uploaded ' + userEmails+'.jpg');
            });

            res.sendFile(__dirname)

            user.avatar=userEmails
            user.save()

        })








    }


};
