let Postcard = require('../models/postcard');
let User = require('../models/user');
let newsFactory = require('../services/news-factory');

module.exports.create = function (req, res) {
    User.findById(req.auth.id)
        .populate('penPal')
        .exec()
        .then(user => {
            console.log(req.body);
            let postcard = new Postcard({
                author: user.id,
                recipient: user.penPal._id,
                body: req.body.body,
                creationDate: new Date()
            });

            newsFactory.newPostcard(user, (news) => {
                user.penPal.news = news;
                user.penPal.save(() => {
                    postcard.save().then(postcard => {
                        res.send({
                            msg: 'Postcard saved',
                            data: postcard
                        });
                    });
                });
            });

        });
};