module.exports = app => {
    get = async (req, res) => {
        const params = {}

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

        if (!!req.query.status) {
            params.status = req.query.status
        }

        const paramsHome = { ...params }
        const paramsAway = { ...params }

        if (!!req.query.teamId) {
            paramsHome.team_home_id = req.query.teamId
            paramsAway.team_away_id = req.query.teamId
        }

        app.db.select('teams.id as teamId',
            'teams.name as teamName',
            'teams.logo as teamLogo',
            'fixtures.home_team_end_status as teamEndStatus',
            'fixtures.home_fulltime_goals as teamGoalsFor',
            'fixtures.away_fulltime_goals as teamGoalsAgainst',
            'fixtures.home_shots_on_goal as teamShotsOnGoalFor',
            'fixtures.away_shots_on_goal as teamShotsOnGoalAgainst',
            'fixtures.home_shots_off_goal as teamShotsOffGoalFor',
            'fixtures.away_shots_off_goal as teamShotsOffGoalAgainst',
            'fixtures.home_total_shots as teamTotalShotsFor',
            'fixtures.away_total_shots as teamTotalShotsAgainst',
            'fixtures.home_blocked_shots as teamBlockedShotsFor',
            'fixtures.away_blocked_shots as teamBlockedShotsAgainst',
            'fixtures.home_insidebox_shots as teamInsideboxShotsFor',
            'fixtures.away_insidebox_shots as teamInsideboxShotsAgainst',
            'fixtures.home_outsidebox_shots as teamOutsideboxShotsFor',
            'fixtures.away_outsidebox_shots as teamOutsideboxShotsAgainst',
            'fixtures.home_fouls as teamFoulsFor',
            'fixtures.away_fouls as teamFoulsAgainst',
            'fixtures.home_corners as teamCornersFor',
            'fixtures.away_corners as teamCornersAgainst',
            'fixtures.home_offsides as teamOffsidesFor',
            'fixtures.away_offsides as teamOffsidesAgainst',
            'fixtures.home_ball_possession as teamBallPossession',
            'fixtures.home_yellow_cards as teamYellowCardsFor',
            'fixtures.away_yellow_cards as teamYellowCardsAgainst',
            'fixtures.home_red_cards as teamRedCardsFor',
            'fixtures.away_red_cards as teamRedCardsAgainst',
            'fixtures.home_goalkeeper_save as teamGoalkeeperSaveFor',
            'fixtures.away_goalkeeper_save as teamGoalkeeperSaveAgainst',
            'fixtures.home_total_passes as teamTotalPassesFor',
            'fixtures.away_total_passes as teamTotalPassesAgainst',
            'fixtures.home_passes_accurate as teamPassesAccurateFor',
            'fixtures.away_passes_accurate as teamPassesAccurateAgainst',
            app.db.raw("'home' as side"))
            .from('fixtures')
            .innerJoin('teams', 'fixtures.team_home_id', 'teams.id')
            .where(paramsHome)
            .unionAll(function () {
                this.select('teams.id as teamId',
                    'teams.name as teamName',
                    'teams.logo as teamLogo',
                    'fixtures.away_team_end_status as teamEndStatus',
                    'fixtures.away_fulltime_goals as teamGoalsFor',
                    'fixtures.home_fulltime_goals as teamGoalsAgainst',
                    'fixtures.away_shots_on_goal as teamShotsOnGoalFor',
                    'fixtures.home_shots_on_goal as teamShotsOnGoalAgainst',
                    'fixtures.away_shots_off_goal as teamShotsOffGoalFor',
                    'fixtures.home_shots_off_goal as teamShotsOffGoalAgainst',
                    'fixtures.away_total_shots as teamTotalShotsFor',
                    'fixtures.home_total_shots as teamTotalShotsAgainst',
                    'fixtures.away_blocked_shots as teamBlockedShotsFor',
                    'fixtures.home_blocked_shots as teamBlockedShotsAgainst',
                    'fixtures.away_insidebox_shots as teamInsideboxShotsFor',
                    'fixtures.home_insidebox_shots as teamInsideboxShotsAgainst',
                    'fixtures.away_outsidebox_shots as teamOutsideboxShotsFor',
                    'fixtures.home_outsidebox_shots as teamOutsideboxShotsAgainst',
                    'fixtures.away_fouls as teamFoulsFor',
                    'fixtures.home_fouls as teamFoulsAgainst',
                    'fixtures.away_corners as teamCornersFor',
                    'fixtures.home_corners as teamCornersAgainst',
                    'fixtures.away_offsides as teamOffsidesFor',
                    'fixtures.home_offsides as teamOffsidesAgainst',
                    'fixtures.away_ball_possession as forBallPossession',
                    'fixtures.away_yellow_cards as teamYellowCardsFor',
                    'fixtures.home_yellow_cards as teamYellowCardsAgainst',
                    'fixtures.away_red_cards as teamRedCardsFor',
                    'fixtures.home_red_cards as teamRedCardsAgainst',
                    'fixtures.away_goalkeeper_save as teamGoalkeeperSaveFor',
                    'fixtures.home_goalkeeper_save as teamGoalkeeperSaveAgainst',
                    'fixtures.away_total_passes as teamTotalPassesFor',
                    'fixtures.home_total_passes as teamTotalPassesAgainst',
                    'fixtures.away_passes_accurate as teamPassesAccurateFor',
                    'fixtures.home_passes_accurate as teamPassesAccurateAgainst',
                    app.db.raw("'away' as side"))
                    .from('fixtures')
                    .innerJoin('teams', 'fixtures.team_away_id', 'teams.id')
                    .where(paramsAway)
            }
            )
            .then(fixtures => {
                res.json(fixtures)
            }).catch(err => {
                console.log(err)
                res.status(500).send(err)
            })
    }

    return { get }
}
