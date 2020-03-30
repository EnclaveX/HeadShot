module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/countries')
        .post(app.api.countries.save)
        .get(app.api.countries.get)

    app.route('/leagues')
        .post(app.api.leagues.save)
        .get(app.api.leagues.get)

    app.route('/menus')
        .get(app.api.menus.get)

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