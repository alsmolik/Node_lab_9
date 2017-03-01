const routes = require('express').Router();
const bcrypt = require('bcrypt');
const users = require('../../models').User;
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const response = require('../../helpers/response');

routes.post("/", (req, res) => {
    if (!req.body.username || !req.body.password) {
        response(req, res.status(400), { status: "error", message: "Wrong params" });
    } else {
        users.findOne({ where: { username: req.body.username } })
            .then((user => {
                if (!user) {
                    response(req, res.status(404), { status: "error", message: "Wrong username" });
                } else {
                    bcrypt.compare(req.body.password, user.password, (err, success) => {
                        if (success) {
                            let token = jwt.sign({ id: user.id, username: user.username }, config.secret_key);

                            response(req, res,
                                {
                                    status: "success",
                                    token: token
                                });
                        } else {
                            response(req, res.status(401), { status: "error", message: "Wrong password" });
                        }
                    });
                }
            }))
            .catch(() => {
                response(req, res.status(500), { status: "error", message: "Server error" });
            });
    }
});

module.exports = routes;