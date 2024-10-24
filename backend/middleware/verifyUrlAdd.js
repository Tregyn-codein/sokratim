const db = require("../models");
const Url = db.url;

checkNameAvailability = (req, res, next) => {
    const systemNames = ['login', 'register', 'shorten', 'dashboard', 'redirect', 'notfound'];
    if (systemNames.includes(req.body.shortened_name)) {
        res.status(400).send({
            available: false
        });
        return;
    }

    Url.findOne({
        where: {
            shortened_name: req.body.shortened_name
        }
    }).then(url => {
        if (url) {
            res.status(400).send({
                available: false
            });
            return;
        }
        next();
    });
};

const verifyUrlAdd = {
    checkNameAvailability: checkNameAvailability,
};

module.exports = verifyUrlAdd;
