module.exports = app => {
	getByName = function (countryName) {
		return app.db('countries')
			.where({ name: countryName })
			.first()
			.then(resp => resp)
	}

	get = async (req, res) => {
		if (!!req.query.countryName) {
			let countryName = req.query.countryName

			return app.db('countries')
				.where({ name: countryName })
				.then(countries => {
					res.json(countries)
				}).catch(err => {
					res.status(500).send(err)
				})
		} else {
			return app.db('countries')
				.then(countries => {
					res.json(countries)
				}).catch(err => {
					res.status(500).send(err)
				})
		}

	}

	save = async (req, res) => {
		const countries = req.body

		let countryDB

		const insertCountries = function (countries) {
			const resolveCountries = new Promise((resolve, reject) => {
				countries.forEach(async (country, index, countries) => {
					if (!country.code) {
						country.code = 'NN'
					}

					if (!country.flag) {
						country.flag = ''
					}

					if (country.name) {
						countryDB = await getByName(country.name)
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
								reject(err)
							})
					} else {
						app.db('countries')
							.insert(country)
							.catch(err => {
								reject(err)
							})
					}

					if (index === countries.length - 1) {
						resolve(countries)
					}
				})
			})

			return resolveCountries
		}

		const promiseReturn = await insertCountries(countries)
			.then(countries => {
				return Promise.all(countries).then(country => {
					return country;
				});
			});

		res.status(204).send()
	}

	return { save, get }
}