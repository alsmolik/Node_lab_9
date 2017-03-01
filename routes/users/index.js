const routes = require('express').Router();
const bcrypt = require('bcrypt');
const users = require('../../models').User;
const response = require('../../helpers/response');

routes.post("/", (req, res) => {
    if (!req.body.username || !req.body.password) {
        response(req, res.status(400), { status: "error", message: "Wrong params" });
    } else {
        const salt = bcrypt.genSaltSync(10);
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                response(req, res.status(500), { status: "error", message: "Server error" });
            } else {
                users.build({ username: req.body.username, password: hash })
                    .save()
                    .then(user => { response(req, res.status(201), { status: "success", user_id: user.id }); })
                    .catch(err => { response(req, res.status(500), { status: "error", message: "Server error" }); });
            }
        });
    }
});

routes.get("/", (req, res) => {
    let limit = +req.query.limit || 10;
    let offset = +req.query.offset || 0;

    users.findAndCountAll({ attributes: { exclude: 'password' }, limit: limit, offset: offset })
        .then(result => {
            response(req, res,
                {
                    metadata: {
                        count: result.count,
                        offset: offset,
                        limit: limit
                    },
                    users: result.rows.map(user => { return { user: { id: user.id, username: user.username } } })
                });
        })
        .catch(err => { response(req, res.status(500), { status: "error", message: "Server error" }); });
});

module.exports = routes;