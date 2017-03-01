const routes = require('express').Router();
const users = require('./users');
const session = require('./session');
const domains = require('./domains');
const payments = require('./payments');
const auth = require('../middlewares/auth');
const format = require('../middlewares/format');

routes.use(format);
routes.use('/users', users);
routes.use('/session', session);
routes.use(auth);
routes.use('/domains', domains);
routes.use('/payments', payments);

module.exports = routes;