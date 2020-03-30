
module.exports = app => {
	getByCode = function (countryCode) {
		return app.db('countries')
			.where({ code: countryCode })
			.first()
			.then(resp => resp)
	}

	get = async (req, res) => {
		app.db('countries')
			.then(countries => {
				res.json(countries)
			}).catch(err => {
				res.status(500).send(err)
			})
	}

	save = async (req, res) => {
		const countries = req.body

		let countryDB
		
		countries.forEach(async country => {
			if (!country.code){
				country.code	= '-'
				country.flag	= ''
			}

			if (country.code) {
				countryDB = await getByCode(country.code)
			}

			let countryExists = false

			if (!!countryDB && !!countryDB.id) {
				countryExists = true
				
				country.id = countryDB.id
			} else {
				countryExists = false
			}

			if (countryExists) {
				app.db('countries')
					.update(country)
					.where({ id: country.id })
					.catch(err => {
						return res.status(500).send(err)
					})
			} else {
				app.db('countries')
					.insert(country)
					.catch(err => {
						return res.status(500).send(err)
					})
			}
		})
	}

	return { save, get }
}