const domains = require('../models').Domain;
const request = require('request');

module.exports = function (name) {
    return new Promise((resolve, reject) => {
        domains.count({ where: { name: name } }).then(count => {
            if (count > 0) {
                return resolve(false);
            } else {
                request("https://api.domainr.com/v2/status?domain=" + name + "&client_id=fb7aca826b084569a50cfb3157e924ae", function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        if (JSON.parse(body).status[0].status.includes('active')) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    } else {
                        reject();
                    }
                });
            }
        });
    });
};