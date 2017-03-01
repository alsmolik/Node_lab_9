const routes = require('express').Router();
const domains = require('../../models').Domain;
const domainAvailability = require('../../helpers/domainAvailability');
const response = require('../../helpers/response');

routes.get("/:domain", (req, res) => {
    domainAvailability(req.params.domain)
        .then(result => {
            if (result) {
                response(req, res, { status: "success", domain_status: "undelegated" })
            } else {
                response(req, res, { status: "success", domain_status: "active" });
            }
        })
        .catch((err) => {
            response(req, res.status(500), { status: "error", message: "Server error" });
        });
});

routes.post("/", (req, res) => {
    if (!req.body.name) {
        response(req, res.status(400), { status: "error", message: "Wrong params" });
    } else {
        domainAvailability(req.body.name)
            .then(result => {
                if (result) {
                    domains.build({ name: req.body.name, UserId: req.user.id })
                        .save()
                        .then(domain => { response(req, res.status(201), { status: "success", domain_id: domain.id }); })
                        .catch(err => { response(req, res.status(500), { status: "error", message: "Server error" }); });
                } else {
                    response(req, res.status(409), { status: "error", domain_status: "Domain is not available" });
                }
            })
            .catch((err) => {
                response(req, res.status(500), { status: "error", message: "Server error" });
            });
    }
});

routes.get("/", (req, res) => {
    let limit = +req.query.limit || 10;
    let offset = +req.query.offset || 0;

    domains.findAndCountAll({ limit: limit, offset: offset })
        .then(result => {
            response(req, res,
                {
                    metadata: {
                        count: result.count,
                        offset: offset,
                        limit: limit
                    },
                    domains: result.rows.map(domain => { return { domain: { id: domain.id, name: domain.name, expires: domain.expires } } })
                });
        })
        .catch(err => { response(req, res.status(500), { status: "error", message: "Server error" }); });
});

routes.put("/:domain", (req, res) => {
    if (!req.body.userId) {
        response(req, res.status(400), { status: "error", message: "Wrong params" });
    } else {
        domains.update({ UserId: req.body.userId }, { where: { name: req.params.domain } })
            .then(result => {
                response(req, res, { status: "success" });
            })
            .catch(err => { response(req, res.status(500), { status: "error", message: "Server error" }); });
    }
});

module.exports = routes;