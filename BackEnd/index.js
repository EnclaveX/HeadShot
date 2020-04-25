const app = require('express')()
const compression = require('compression')
const bodyParser = require('body-parser');
const consign = require('consign')
const db = require('./config/db')

app.db = db

app.use(bodyParser.json({ limit: "5mb" }));
app.use(compression());

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validations')
    .then('./api')
    .then('./config/routes.js')
    .then('./config/global.js')
    .into(app)

app.listen(3001, () => {
    console.log('Backend executando.')
}) 