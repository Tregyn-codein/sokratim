const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.user;
const Url = db.url;
const { checkNameAvailability } = require("../middleware/verifyUrlAdd");

exports.createShortenedUrl = (req, res) => {
    let name = req.body.shortened_name;
    if (!name) {
        // Генерируем случайное имя, если не указано
        do {
            name = Math.random().toString(36).substring(2, 8);
        } while (
            !Url.findOne({
                where: {
                    shortened_name: name
                }
            })
            ); // Убеждаемся, что имя не занято
    }

    Url.create({
        original_url: req.body.original_url,
        shortened_name: name,
        user_id: req.userId
    })
    return res.status(201).send({ shortened_name: `https://localhost:4000/${name}` });
};

exports.isNameAvailability = (req, res) => {
    res.status(200).send({ available: true });
};


exports.getUrlsList = (req, res) => {
    Url.findAll({
        where: {
            user_id: req.userId
        }
    }).then(urls => {
        res.send(urls);
    });
}

exports.deleteUrl = (req, res) => {
    Url.destroy({
        where: {
            id: req.params.id
        }
    }).then(urls => {
        res.status(200).send({ message: "Ссылка удалена" });
    });
}

exports.redirectToUrl = (req, res) => {
    Url.findOne({
        where: {
            shortened_name: req.params.shortLinkName
        }
    }).then(url => {
        if (url) {
            Url.update({ clicks: url.clicks + 1 }, { where: { id: url.id } });
            res.status(200).send( { original_url: url.original_url} );
        } else {
            res.status(404).send({ message: "Ссылка не найдена" });
        }

    });
}
// // Проверяем, свободно ли имя
// async function checkNameAvailability(name) {
//     const result = await db.query('SELECT COUNT(*) as count FROM urls WHERE shortened_name = ?', [name]);
//     return result[0][0].count === 0;
// }
//
// // Создаём сокращённую ссылку
// async function createShortenedUrl(originalUrl, shortenedName, userId) {
//     let name = shortenedName;
//     if (!name) {
//         // Генерируем случайное имя, если не указано
//         do {
//             name = Math.random().toString(36).substring(2, 8);
//         } while (!(await checkNameAvailability(name))); // Убеждаемся, что имя не занято
//     }
//
//     // Вставляем в базу данных
//     await db.query('INSERT INTO urls (original_url, shortened_name, user_id) VALUES (?, ?, ?)', [originalUrl, name, userId]);
//
//     // Возвращаем полный URL
//     return `https://localhost:4000/${name}`;
// }

