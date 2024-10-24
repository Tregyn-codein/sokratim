const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    email: req.body.email,
    password_hash: bcrypt.hashSync(req.body.password, 8)
  })
  return res.status(201).send({ message: "Пользователь зарегистрирован" });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
        email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Неверный email или пароль" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password_hash
      );

      if (!passwordIsValid) {
        return res.status(401).send({message: "Неверный email или пароль"});
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      return res.status(200).json({token});
    });
};
