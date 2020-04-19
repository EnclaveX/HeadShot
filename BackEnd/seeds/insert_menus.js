
exports.seed = function (knex, Promise) {
	return knex('menu_items').del()
		.then(function () {
			return knex('menus').del()
		})
		.then(function () {
			return knex('menus').insert([
				{ id: 1, name: 'teams', icon: 'mdi-soccer', order: 0 },
				{ id: 2, name: 'bets', icon: 'mdi-alpha-b-circle-outline', order: 1 },
				{ id: 3, name: 'configurations', icon: 'mdi-cogs', order: 2 }
			]);
		})
		.then(function () {
			return knex('menu_items').insert([
				{ id: 1, name: 'countries', order: 0, menu_id: 1 },
				{ id: 2, name: 'teams', order: 1, menu_id: 1 },
				{ id: 3, name: 'gamesSugestion', order: 4, menu_id: 1 },
				{ id: 4, name: 'bettingList', order: 1, menu_id: 2 },
				{ id: 5, name: 'analyticalReports', order: 2, menu_id: 2 },
				{ id: 6, name: 'loadApis', order: 1, menu_id: 3 },
				{ id: 7, name: 'leagues', order: 2, menu_id: 1 },
				{ id: 8, name: 'standings', order: 3, menu_id: 1 },
				{ id: 9, name: 'anothers', order: 2, menu_id: 3 }
			]);
		});
};