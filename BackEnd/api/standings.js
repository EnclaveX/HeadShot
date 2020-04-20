module.exports = app => {
    const getByRank = function (standingRank, leagueId, seasonId) {
        params = {
            rank: standingRank,
            league_id: leagueId,
            season_id: seasonId
        }

        return app.db('standings')
            .where(params)
            .first()
            .then(resp => resp)
    }

    get = async (req, res) => {
        let params = {}

        if (!!req.query.seasonId) {
            params.season_id = req.query.seasonId
        }

        if (!!req.query.leagueId) {
            params.league_id = req.query.leagueId
        }

        app.db.select('standings.rank',
            'standings.team_id as teamId',
            'teams.name as teamName',
            'teams.logo as teamLogo',
            'standings.league_id as leagueId',
            'standings.season_id as seasonId',
            'standings.points',
            'standings.goals_for as goalsFor',
            'standings.goals_against as goalsAgainst',
            'standings.goals_diff as goalsDiff',
            'standings.played',
            'standings.win',
            'standings.draw',
            'standings.lose',
            'standings.home_goals_for as homeGoalsFor',
            'standings.home_goals_against as homeGoalsAgainst',
            'standings.home_played as homePlayed',
            'standings.home_win as homeWin',
            'standings.home_draw as homeDraw',
            'standings.home_lose as homeLose',
            'standings.away_goals_for as awayGoalsFor',
            'standings.away_goals_against as awayGoalsAgainst',
            'standings.away_played as awayPlayed',
            'standings.away_win as awayWin',
            'standings.away_draw as awayDraw',
            'standings.away_lose as awayLose',
            'standings.form as lastFive')
            .from('standings')
            .innerJoin('teams', 'standings.team_id', 'teams.id')
            .where(params)
            .orderBy('standings.rank', 'asc')
            .then(standings => {
                res.json(standings)
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    save = async (req, res) => {
        const standings = req.body

        let standingDB

        const insertStandings = function (standings) {
            const resolveStandings = new Promise((resolve, reject) => {
                standings.forEach(async (standing, index, standings) => {
                    if (!!standing.rank) {
                        standingDB = await getByRank(standing.rank, standing.league_id, standing.season_id)
                    }

                    let standingExists = false

                    if (!!standingDB && standingDB.rank) {
                        standingExists = true
                    } else {
                        standingExists = false
                    }

                    if (standingExists) {
                        const rank = standing.rank
                        const leagueId = standing.league_id
                        const seasonId = standing.season_id

                        delete standing.rank
                        delete standing.league_id
                        delete standing.season_id

                        app.db('standings')
                            .where('rank', rank)
                            .andWhere('league_id', leagueId)
                            .andWhere('season_id', seasonId)
                            .update(standing)
                            .catch(err => {
                                reject(err)
                            })
                    } else {
                        app.db('standings')
                            .insert(standing)
                            .catch(err => {
                                reject(err)
                            })
                    }

                    if (index === standings.length - 1) {
                        resolve(standings)
                    }
                })
            })

            return resolveStandings
        }

        await insertStandings(standings)
            .then(standings => {
                return Promise.all(standings).then(standing => {
                    return standing;
                }); 
            })
            .then(() => {
                res.status(204).send()
            })
            .catch((err) => {
                res.status(500).send(err)
            });

    }

    return { save, get }
}