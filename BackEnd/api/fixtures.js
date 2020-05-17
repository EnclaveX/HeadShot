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
        let limit = null

        if (!!req.query.seasonId) {
            params.season_id = req.query.seasonId
        }

        if (!!req.query.leagueId) {
            params.league_id = req.query.leagueId
        }

        if (!!req.query.loadedStatistics) {
            params.loaded_statistics = req.query.loadedStatistics
        }

        if (!!req.query.status) {
            params.status = req.query.status
        }

        if (!!req.query.id) {
            params["fixtures.id"] = req.query.id
        }

        if (!!req.query.limit) {
            limit = req.query.limit
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
            'fixtures.away_penalty_goals as awayPenaltyGoals',
            'fixtures.home_shots_on_goal as homeShotsOnGoal',
            'fixtures.away_shots_on_goal as awayShotsOnGoal',
            'fixtures.home_shots_off_goal as homeShotsOffGoal',
            'fixtures.away_shots_off_goal as awayShotsOffGoal',
            'fixtures.home_total_shots as homeTotalShots',
            'fixtures.away_total_shots as awayTotalShots',
            'fixtures.home_blocked_shots as homeBlockedShots',
            'fixtures.away_blocked_shots as awayBlockedShots',
            'fixtures.home_insidebox_shots as homeInsideboxShots',
            'fixtures.away_insidebox_shots as awayInsideboxShots',
            'fixtures.home_outsidebox_shots as homeOutsideboxShots',
            'fixtures.away_outsidebox_shots as awayOutsideboxShots',
            'fixtures.home_fouls as homeFouls',
            'fixtures.away_fouls as awayFouls',
            'fixtures.home_corners as homeCorners',
            'fixtures.away_corners as awayCorners',
            'fixtures.home_offsides as homeOffsides',
            'fixtures.away_offsides as awayOffsides',
            'fixtures.home_ball_possession as homeBallPossession',
            'fixtures.away_ball_possession as awayBallPossession',
            'fixtures.home_yellow_cards as homeYellowCards',
            'fixtures.away_yellow_cards as awayYellowCards',
            'fixtures.home_red_cards as homeRedCards',
            'fixtures.away_red_cards as awayRedCards',
            'fixtures.home_goalkeeper_save as homeGoalkeeperSave',
            'fixtures.away_goalkeeper_save as awayGoalkeeperSave',
            'fixtures.home_total_passes as homeTotalPasses',
            'fixtures.away_total_passes as awayTotalPasses',
            'fixtures.home_passes_accurate as homePassesAccurate',
            'fixtures.away_passes_accurate as awayPassesAccurate')
            .from('fixtures')
            .innerJoin('teams as teamsHome', 'fixtures.team_home_id', 'teamsHome.id')
            .innerJoin('teams as teamsAway', 'fixtures.team_away_id', 'teamsAway.id')
            .where(params)
            .limit(limit)
            .orderBy('fixtures.id', 'asc')
            .then(fixtures => {
                res.json(fixtures)
            }).catch(err => {
                console.error(err)
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

                    if (!!fixture.home_ball_possession) {
                        fixture.home_ball_possession = parseInt(fixture.home_ball_possession.replace('%', ''))
                    }

                    if (!!fixture.away_ball_possession) {
                        fixture.away_ball_possession = parseInt(fixture.away_ball_possession.replace('%', ''))
                    }

                    if (!!fixtureDB && fixtureDB.id) {
                        const id = fixture.id

                        delete fixture.id

                        app.db('fixtures')
                            .where('id', id)
                            .update(fixture)
                            .catch(err => {
                                console.log(err)
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

        await insertFixtures(fixtures)
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