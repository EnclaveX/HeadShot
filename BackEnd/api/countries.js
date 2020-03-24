
module.exports = app => {

	findCountry = function (countryCode) {
		return app.db('countries')
			.where({ code: countryCode })
			.first()
	}

	insertCountries = async (req, res) => {
		const countries = req.body
		let countryDB

		countries.forEach(async country => {
			try {
				if (country.code) {
					countryDB = await findCountry(country.code)
				} else {
					return
				}

				let countryExists = false

				if (countryDB.id) {
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
			} catch (err) {
				res.status(400).send(err)
			}
		})

		res.status(204).send()
	}

	return { insertCountries }
}