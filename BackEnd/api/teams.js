module.exports = app => {
    const getById = function (teamId) {
        return app.db('teams')
            .where({
                id: teamId
            })
            .first()
            .then(resp => resp)
    }

    get = async (req, res) => {
        app.db.select('teams.id',
            'teams.name',
            'teams.logo')
            .from('teams')
            .then(teams => {
                res.json(teams)
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    save = async (req, res) => {
        const teams = req.body

        let teamDB

        const insertTeams = function (teams) {
            const resolveTeams = new Promise((resolve, reject) => {
                teams.forEach(async (team, index, teamss) => {
                    if (!!team.id) {
                        teamDB = await getById(team.id)
                    }

                    if (!!teamDB && teamDB.id) {
                        app.db('teams')
                            .update(team)
                            .where({ id: team.id })
                            .catch(err => {
                                reject(err)
                            })
                    } else {
                        app.db('teams')
                            .insert(team)
                            .catch(err => {
                                reject(err)
                            })
                    }

                    if (index === teams.length - 1) {
                        resolve(teams)
                    }
                })
            })

            return resolveTeams
        }

        await insertTeams(teams)
            .then(teams => {
                return Promise.all(teams).then(team => {
                    return team;
                });
            })
            .then(() => {
                res.status(204).send()
            })
            .catch(err => {
                res.status(500).send(err)
            });

    }
    return { save, get }
}