const db = require("../models");
const User = db.user;

checkDuplicateEmail = (req, res, next) => {
    // Email
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Ошибка! Пользователь с таким Email уже существует"
            });
            return;
        }
        next();
    });
};

const verifySignUp = {
    checkDuplicateEmail: checkDuplicateEmail,
};

module.exports = verifySignUp;
