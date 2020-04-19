module.exports = app => {
    const getById = function (leagueId) {
        return app.db('leagues')
            .where({ id: leagueId })
            .first()
            .then(resp => resp)
    }

    getWithSeasons = async (req, res) => {
        let params = {}

        if (!!req.query.favorite) {
            params.favorite = req.query.favorite ? 1 : 0
        }

        if (!!req.query.current) {
            params.current = req.query.current ? '1' : '0'
        }

        app.db.select('leagues.id as leagueId',
            'seasons.id as seasonId',
            'seasons.year as seasonYear')
            .from('leagues')
            .innerJoin('seasons', 'leagues.id', 'seasons.league_id')
            .where(params)
            .then(leagues => {
                res.json(leagues)
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    get = async (req, res) => {
        let params = {}

        if (!!req.query.favorite) {
            params.favorite = req.query.favorite ? 1 : 0
        }

        app.db.select('leagues.id',
            'leagues.name',
            'leagues.type',
            'leagues.logo',
            'leagues.country_id',
            'leagues.favorite',
            'countries.name as countryName')
            .from('leagues')
            .innerJoin('countries', 'leagues.country_id', 'countries.id')
            .where(params)
            .then(leagues => {
                res.json(leagues)
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    save = async (req, res) => {
        const leagues = req.body
        let leagueDB

        const insertLeagues = function (leagues) {
            const resolveLeagues = new Promise((resolve, reject) => {
                leagues.forEach(async (league, index, leagues) => {
                    if (!!league.id) {
                        leagueDB = await getById(league.id)
                    }

                    let leagueExists = false

                    if (!!leagueDB && leagueDB.id) {
                        leagueExists = true
                    } else {
                        leagueExists = false
                    }

                    if (league.logo === null) {
                        league.logo = ''
                    }

                    if (!!league.seasons && league.seasons.length > 0) {
                        var seasons = [...league.seasons]
                    } else {
                        var seasons = []
                    }

                    delete league.seasons

                    if (!!league.name) {
                        if (leagueExists) {
                            app.db('leagues')
                                .update(league)
                                .where({ id: league.id })
                                .then(async () => {
                                    return await saveSeasonByLeague(seasons)
                                })
                                .catch(err => {
                                    reject(err)
                                })
                        } else {
                            league.favorite = 0

                            app.db('leagues')
                                .insert(league)
                                .then(async (league) => {
                                    return await saveSeasonByLeague(seasons)
                                })
                                .catch(err => {
                                    reject(err)
                                })
                        }
                    } else {
                        reject('err')
                    }

                    if (index === leagues.length - 1) {
                        resolve(leagues)
                    }
                })
            })

            return resolveLeagues
        }

        const promiseReturn = await insertLeagues(leagues)
            .then(leagues => {
                return Promise.all(leagues).then(league => {
                    return league;
                });
            })
            .then(() => {
                res.status(204).send()
            });

    }

    const saveSeasonByLeague = async (seasons) => {
        let seasonDB

        const insertSeasons = function (season) {
            const resolveSeasons = new Promise((resolve, reject) => {
                seasons.forEach(async (season, index, seasons) => {
                    if (season.year && season.leagueId) {
                        seasonDB = await getSeasonByYearLeague(season.year, season.leagueId)
                    }

                    let seasonExists = false

                    if (!!seasonDB && !!seasonDB.id) {
                        seasonExists = true

                        season.id = seasonDB.id
                    } else {
                        seasonExists = false
                    }

                    if (seasonExists) {
                        app.db('seasons')
                            .update(season)
                            .where({ id: season.id })
                            .catch(err => {
                                reject(err)
                            })
                    } else {
                        app.db('seasons')
                            .insert(season)
                            .catch(err => {
                                reject(err)
                            })
                    }

                    if (index === seasons.length - 1) {
                        resolve(seasons)
                    }
                })
            })

            return resolveSeasons
        }

        const promiseReturn = await insertSeasons(seasons)
            .then(seasons => {
                return Promise.all(seasons).then(season => {
                    return season;
                });
            });

        return promiseReturn
    }

    return { save, get, getWithSeasons }
}