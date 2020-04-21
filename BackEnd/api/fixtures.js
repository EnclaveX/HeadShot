module.exports = app => {
    const getById = (fixtureId) => {
        params = {
            id: fixtureId
        }

        return app.db('fixtures')
            .where(params)
            .first()
            .then(resp => resp)
    }

    get = (req, res) => {
        let params = {}

        if (!!req.query.seasonId) {
            params.season_id = req.query.seasonId
        }

        if (!!req.query.leagueId) {
            params.league_id = req.query.leagueId
        }

        app.db.select(
            'fixtures.id',
            'fixtures.venue',
            'fixtures.status',
            'fixtures.round',
            'fixtures.round_number as roundNumber',
            'fixtures.fixture_date as fixtureDate',
            'fixtures.extratime',
            'fixtures.penalty',
            'fixtures.team_home_id as teamHomeId',
            'teamsHome.name as teamHomeName',
            'teamsHome.logo as teamHomeLogo',
            'fixtures.home_fulltime_goals as homeFulltimeGoals',
            'fixtures.home_halftime_goals as homeHalftimeGoals',
            'fixtures.home_extratime_goals as homeExtratimeGoals',
            'fixtures.home_penalty_goals as homePenaltyGoals',
            'fixtures.team_away_id as teamAwayId',
            'teamsAway.name as teamAwayName',
            'teamsAway.logo as teamAwayLogo',
            'fixtures.away_fulltime_goals as awayFulltimeGoals',
            'fixtures.away_halftime_goals as awayHalftimeGoals',
            'fixtures.away_extratime_goals as awayExtratimeGoals',
            'fixtures.home_team_end_status as homeTeamEndStatus',
            'fixtures.away_team_end_status as awayTeamEndStatus',
            'fixtures.away_penalty_goals as awayPenaltyGoals') 
            .from('fixtures')
            .innerJoin('teams as teamsHome', 'fixtures.team_home_id', 'teamsHome.id')
            .innerJoin('teams as teamsAway', 'fixtures.team_away_id', 'teamsAway.id')
            .where(params)
            .orderBy('fixtures.id', 'asc')
            .then(fixtures => {
                res.json(fixtures)
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    save = async (req, res) => {
        const fixtures = req.body

        let fixtureDB

        const insertFixtures = function (fixtures) {
            const resolveFixtures = new Promise((resolve, reject) => {
                fixtures.forEach(async (fixture, index, fixtures) => { 
                    if (!!fixture.id) {
                        fixtureDB = await getById(fixture.id)
                    }

                    let fixtureExists = false

                    if (!!fixtureDB && fixtureDB.id) {
                        fixtureExists = true
                    } else {
                        fixtureExists = false
                    }

                    if (fixtureExists) {
                        const id = fixture.id

                        delete fixture.id

                        app.db('fixtures')
                            .where('id', id)
                            .update(fixture)
                            .catch(err => {
                                reject(err)
                            })
                        } else {
                            app.db('fixtures')
                            .insert(fixture)
                            .catch(err => {
                                reject(err)
                            })
                    }

                    if (index === fixtures.length - 1) {
                        resolve(fixtures)
                    }
                })
            })

            return resolveFixtures
        }

        const promiseReturn = await insertFixtures(fixtures)
            .then(fixtures => {
                return Promise.all(fixtures).then(fixture => {
                    return fixture;
                });
            })
            .then(() => {
                res.status(204).send()
            });

    }

    return { save, get }
}