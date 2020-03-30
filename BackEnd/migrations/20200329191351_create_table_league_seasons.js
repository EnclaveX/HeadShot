exports.up = function (knex, Promise) {
    return knex.schema.createTable('seasons', table => {
        table.increments('id').primary()
        table.string('year').notNull()
        table.date('start').notNull()
        table.date('end').notNull()
        table.string('current').notNull()
        table.integer('league_id').notNull()
        table.foreign('league_id').references('leagues.id'),
        table.string('fixture_events').notNull()
        table.string('fixture_lineups').notNull()
        table.string('fixture_statistics').notNull()
        table.string('fixture_statistics_players').notNull()
        table.string('standings').notNull()
        table.string('players').notNull()
        table.string('top_scorers').notNull()
        table.string('predictions').notNull()
        table.string('odds').notNull()

    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('seasons')
};
