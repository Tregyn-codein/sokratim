const { authJwt } = require("../middleware");
const { verifyUrlAdd } = require("../middleware");

const controller = require("../controllers/url.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/url/shorten",
        [
            authJwt.verifyToken,
            verifyUrlAdd.checkNameAvailability,
        ],
        controller.createShortenedUrl
    );

    app.post(
        "/api/url/check-name",
        [
            authJwt.verifyToken,
            verifyUrlAdd.checkNameAvailability
        ],
        controller.isNameAvailability
    );

    app.get(
        "/api/url/dashboard",
        [
            authJwt.verifyToken,
        ],
        controller.getUrlsList
    );

    app.delete(
        "/api/url/:id",
        [
            authJwt.verifyToken,
        ],
        controller.deleteUrl
    );

    app.get(
        "/:shortLinkName",
        [],
        controller.redirectToUrl
    );
};
