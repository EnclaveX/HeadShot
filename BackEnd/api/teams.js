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

                    let teamExists = false

                    if (!!teamDB && teamDB.id) {
                        teamExists = true
                    } else {
                        teamExists = false
                    }

                    if (teamExists) {
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

        const promiseReturn = await insertTeams(teams)
            .then(teams => {
                return Promise.all(teams).then(team => {
                    return team;
                });
            })
            .then(() => {
                res.status(204).send()
            });

    }
    return { save, get }
}