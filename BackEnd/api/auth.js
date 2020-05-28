const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('headshot.principal.enterMailPassword')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .whereNull('deletedAt')
            .first()

        if (!user) {
            return res.status(400).send('headshot.principal.userNotFound')
        }

        const isMatch = bcrypt.compareSync(req.body.password, user.password)

        if (!isMatch) return res.status(400).send('headshot.principal.mailPasswordIncorrect')

        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {
            return res.send(false)
        }

        res.send(false)
    }

    const updateRequestsPerDay = async (req, res) => {
        const day = new Date().toLocaleDateString()
        const url = req.params.url
        
        let requestsToday = await app.db('requests_per_day')
            .where({
                day: day,
                url: url
            })
            .first()

            
            if (!requestsToday) {
            requestsToday = {
                day: day,
                url: url,
                requests: 1
            }
            
            app.db('requests_per_day')
            .insert(requestsToday)
            .catch(err => {
                console.error(err)
                
                res.send(false)
            })
        } else {
            requestsToday.requests++
            
            const id = requestsToday.id

            delete requestsToday.id

            app.db('requests_per_day')
                .update(requestsToday)
                .where({
                    id: id
                })
                .catch(err => {
                    console.error(err)

                    res.send(false)
                })
        }

        res.send(true)
    }

    const getRequestsPerDay = async (req, res) => {
        const day = new Date().toLocaleDateString()

        let requests = await app.db('requests_per_day')
            .where({
                day: day,
                url: req.params.url
            })
            .first()

        res.json(requests)
    }

    return { signin, validateToken, updateRequestsPerDay, getRequestsPerDay }
}