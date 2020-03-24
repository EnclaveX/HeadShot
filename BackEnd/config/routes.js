module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/countries/insertCountries')
        .post(app.api.countries.insertCountries)

    // app.route('/users/:id')
    //     .all(app.config.passport.authenticate())
    //     .put(app.api.user.save)
    //     .get(app.api.user.getById) 
    //     .delete(app.api.user.remove)
    
    // app.route('/searchUsers/:search')
    //     .all(app.config.passport.authenticate())
    //     .get(app.api.user.searchUser)

    // app.route('/searchUsers')
    //     .all(app.config.passport.authenticate())
    //     .get(app.api.user.searchUser)
}