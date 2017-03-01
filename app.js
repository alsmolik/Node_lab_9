const app = require('express')();
const routes = require('./routes');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const models = require('./models');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.xml({
    xmlParseOptions: {
        explicitRoot: false,
        trim: true,
        explicitArray: false
    }
}));
app.use(bodyParser.json());
app.use('/api', routes);

models.sequelize.sync().then(app.listen(3000));