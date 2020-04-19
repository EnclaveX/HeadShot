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

    app.route('/leagues/seasons')
        .get(app.api.leagues.getWithSeasons)

    app.route('/seasons')
        .get(app.api.seasons.get)

    app.route('/standings')
        .post(app.api.standings.save)
        .get(app.api.standings.get)

    app.route('/standingsPerRound')
        .post(app.api.standingsPerRound.save)
        .get(app.api.standingsPerRound.get)

    app.route('/fixtures')
        .post(app.api.fixtures.save)
        .get(app.api.fixtures.get)

    app.route('/teams')
        .post(app.api.teams.save)
        .get(app.api.teams.get)

    app.route('/apiTests/:name')
        .get(app.api.apiTests.getByName)

    app.route('/apiTests')
        .post(app.api.apiTests.save)
        .get(app.api.apiTests.get)

    app.route('/menus')
        .get(app.api.menus.get)
}