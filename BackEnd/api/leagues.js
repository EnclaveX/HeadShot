
module.exports = app => {
    const getById = function (leagueId) {
        return app.db('leagues')
            .where({ id: leagueId })
            .first()
            .then(resp => resp)
    }

    save = async (req, res) => {
        const leagues = req.body
        let leagueDB

        leagues.forEach(async league => {
            if (league.league.id) {
                leagueDB = await getById(league.league.id)
            }

            let leagueExists = false

            if (!!leagueDB && leagueDB.id) {
                leagueExists = true
            } else {
                leagueExists = false
            }

            if (leagueExists) {
                app.db('leagues')
                    .update(league)
                    .where({ id: league.id })
                    .catch(err => {
                        return res.status(500).send(err)
                    })
            } else {
                console.log(league)
                app.db('leagues')
                    .insert(league)
                    .catch(err => {
                        return res.status(500).send(err)
                    })
            }
        })
    }

    return { save, get }
}