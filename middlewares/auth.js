const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = function (req, res, next) {
    let token = req.body.token || req.query.token;
    if (token) {
        jwt.verify(token, config.secret_key, (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: "error", message: 'Failed to authenticate token' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            status: "error",
            message: 'No token provided'
        });
    }
}