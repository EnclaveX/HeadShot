const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => {
    app.use(bodyParser.json({
        json: {limit: '500mb', extended: true},
        urlencoded: {limit: '500mb', extended: true}
      }))
    app.use(cors())
}