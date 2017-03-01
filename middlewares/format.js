module.exports = function(req, res, next) {
    req.format = req.headers.accept || 'application/json';

    next();
}