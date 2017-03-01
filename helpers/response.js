const jsonxml = require('jsontoxml');

module.exports = function (req, res, data) {
    if (req.format == 'application/xml') {
        res.send(jsonxml({ response: data }));
    } else {
        res.json(data);
    }
}