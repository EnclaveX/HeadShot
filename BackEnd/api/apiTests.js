
module.exports = app => {
    searchByName = function (apiTestName) {
        return app.db('api_test')
            .where({ name: apiTestName })
            .first()
            .then(resp => resp)
    } 

    getByName = async (req, res) => {
        app.db('api_test')
            .where({ name: req.params.name })
            .first()
            .then(apiTest => res.json(apiTest))
            .catch(err => res.status(500).send(err))
    }

    get = async (req, res) => {
        app.db('api_test')
            .then(apiTests => {
                res.json(apiTests)
            }).catch(err => {
                res.status(500).send(err)
            })
    }

    save = async (req, res) => {
        const apiTest = req.body

        let apiTestDB

        if (apiTest.name) {
            apiTestDB = await searchByName(apiTest.name)
        }

        let apiTestExists = false

        if (!!apiTestDB) {
            apiTestExists = true

            apiTest.id = apiTestDB.id
        } else {
            apiTestExists = false
        }

        if (apiTestExists) {
            app.db('api_test')
                .update(apiTest)
                .where({ id: apiTest.id })
                .then(_ => {
                    res.status(204).send()
                })
                .catch(err => {
                    return res.status(500).send(err)
                })
        } else {
            app.db('api_test')
                .insert(apiTest)
                .then(_ => {
                    res.status(204).send()
                })
                .catch(err => {
                    return res.status(500).send(err)
                })
        }
    }

    return { save, get, getByName }
}