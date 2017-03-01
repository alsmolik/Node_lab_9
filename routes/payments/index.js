const routes = require('express').Router();
const payments = require('../../models').Payment;
const response = require('../../helpers/response');

routes.get("/", (req, res) => {
    let limit = +req.query.limit || 10;
    let offset = +req.query.offset || 0;

    payments.findAndCountAll({ limit: limit, offset: offset })
        .then(result => {
            response(req, res,
                {
                    metadata: {
                        count: result.count,
                        offset: offset,
                        limit: limit
                    },
                    payments: result.rows.map(payment => { return { payment: { id: payment.id, period: payment.period, 
                        UserId: payment.UserId, DomainId: payment.DomainId } } })
                });
        })
        .catch(err => { response(req, res.status(500), { status: "error", message: "Server error" }); });
});

routes.post("/", (req, res) => {
    if (!req.body.period || !req.body.domainId) {
        response(req, res.status(400), { status: "error", message: "Wrong params" });
    } else {
        payments.build({ period: req.body.period, UserId: req.user.id, DomainId: req.body.domainId })
            .save()
            .then(payment => { response(req, res.status(201), { status: "success", payment_id: payment.id }); })
            .catch(err => { response(req, res.status(500), { status: "error", message: "Server error" }); });
    }
});

module.exports = routes;