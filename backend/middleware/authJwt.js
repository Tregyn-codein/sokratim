const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
      console.log("Не передан токен!");
    return res.status(403).send({
      message: "Не передан токен!"
    });
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Не авторизован!",
                });
              }
              req.userId = decoded.id;
              next();
            });
};


const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
