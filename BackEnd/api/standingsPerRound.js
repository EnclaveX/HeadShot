module.exports = app => {
    const getByRank = function (standingRank, leagueId, seasonId, round) {
        params = {
            rank: standingRank,
            league_id: leagueId,
            season_id: seasonId,
            round: round
        }

        return app.db('standings_per_round')
            .where(params)
            .first()
            .then(resp => resp)
            .catch((err) => {
                res.status(500).send(err)
            });
    }

    getLastStandingPerRound = (req, res) => {
        let params = {}

        params.season_id = req.query.seasonId
        params.league_id = req.query.leagueId

        app.db('standings_per_round')
            .max('standings_per_round.round_number as roundNumber')
            .where(params)
            .andWhere(function () {
                this.where('status', '=', 'Match Finished')
            })
            .then(maxRoundNumber => {
                res.json(maxRoundNumber)
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    get = async (req, res) => {
        let params = {}

        if (!!req.query.seasonId) {
            params.season_id = req.query.seasonId
        }

        if (!!req.query.leagueId) {
            params.league_id = req.query.leagueId
        }

        if (!!req.query.round) {
            params.round = req.query.round
        }

        if (!!req.query.roundNumber) {
            params.round_number = req.query.roundNumber
        }

        if (!!req.query.teamId) {
            params.team_id = req.query.teamId
        }

        if (!!req.query.status) {
            params.status = req.query.status
        }

        let formSelect = app.db.raw("(select right(string_agg(spr.team_end_status, '' order by spr.round_number asc), 5) " +
            "from standings_per_round as spr " +
            "where spr.league_id = standings_per_round.league_id and " +
            "spr.season_id = standings_per_round.season_id and " +
            "spr.team_id = standings_per_round.team_id and " +
            "spr.round_number <= standings_per_round.round_number) ")

        app.db.select('standings_per_round.rank',
            'standings_per_round.team_id as teamId',
            'teams.name as teamName',
            'teams.logo as teamLogo',
            'standings_per_round.league_id as leagueId',
            'standings_per_round.season_id as seasonId',
            'standings_per_round.round',
            'standings_per_round.round_number as roundNumber',
            'standings_per_round.points',
            'standings_per_round.goals_for as goalsFor',
            'standings_per_round.goals_against as goalsAgainst',
            'standings_per_round.goals_diff as goalsDiff',
            'standings_per_round.played',
            'standings_per_round.win',
            'standings_per_round.draw',
            'standings_per_round.lose',
            'standings_per_round.home_goals_for as homeGoalsFor',
            'standings_per_round.home_goals_against as homeGoalsAgainst',
            'standings_per_round.home_played as homePlayed',
            'standings_per_round.home_win as homeWin',
            'standings_per_round.home_draw as homeDraw',
            'standings_per_round.home_lose as homeLose',
            'standings_per_round.away_goals_for as awayGoalsFor',
            'standings_per_round.away_goals_against as awayGoalsAgainst',
            'standings_per_round.away_played as awayPlayed',
            'standings_per_round.away_win as awayWin',
            'standings_per_round.away_draw as awayDraw',
            'standings_per_round.away_lose as awayLose',
            'standings_per_round.team_end_status as teamEndStatus',
            { lastFive: formSelect })
            .from('standings_per_round')
            .innerJoin('teams', 'standings_per_round.team_id', 'teams.id')
            .where(params)
            .orderByRaw('standings_per_round.round_number asc, standings_per_round.rank asc')
            .then(standingsPerRound => {
                res.json(standingsPerRound)
            }).catch(err => {
                console.error(err)
                res.status(500).send(err)
            })
    }

    save = async (req, res) => {
        const standingsPerRound = req.body

        let standingPerRoundDB

        const insertStandingsPerRound = function (standingsPerRound) {
            const resolveStandingsPerRound = new Promise((resolve, reject) => {
                standingsPerRound.forEach(async (standingPerRound, index, standingsPerRound) => {
                    if (!!standingPerRound.rank) {
                        standingPerRoundDB = await getByRank(
                            standingPerRound.rank,
                            standingPerRound.league_id,
                            standingPerRound.season_id,
                            standingPerRound.round
                        ).catch(e => {
                            throw e
                        })
                    }

                    if (!!standingPerRoundDB && standingPerRoundDB.rank) {
                        const rank = standingPerRound.rank
                        const leagueId = standingPerRound.league_id
                        const seasonId = standingPerRound.season_id
                        const round = standingPerRound.round

                        delete standingPerRound.rank
                        delete standingPerRound.league_id
                        delete standingPerRound.season_id
                        delete standingPerRound.round

                        app.db('standings_per_round')
                            .where('rank', rank)
                            .andWhere('league_id', leagueId)
                            .andWhere('season_id', seasonId)
                            .andWhere('round', round)
                            .update(standingPerRound)
                            .catch(err => {
                                reject(err)
                            })
                    } else {
                        app.db('standings_per_round')
                            .insert(standingPerRound)
                            .catch(err => {
                                reject(err)
                            })
                    }

                    if (index === standingPerRound.length - 1) {
                        resolve(standingsPerRound)
                    }
                })
            })

            return resolveStandingsPerRound
        }

        await insertStandingsPerRound(standingsPerRound)
            .then(standingsPerRound => {
                return Promise.all(standingsPerRound).then(standingPerRound => {
                    return standingPerRound;
                });
            })
            .then(() => {
                res.status(204).send()
            })
            .catch((err) => {
                res.status(500).send(err)
            });

    }

    return { save, get, getLastStandingPerRound }
}