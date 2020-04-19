
module.exports = app => {
    const get = async (req, res) => {
        let params = {}

        if (!!req.query.year) {
            params.year = req.query.year
        }

        if (!!req.query.leagueId) {
            params.league_id = req.query.leagueId
        }

        app.db('seasons')
            .where(params)
            .then(seasons => {
                res.json(seasons)
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    return { get }
}