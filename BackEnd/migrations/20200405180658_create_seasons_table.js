
exports.up = function (knex, Promise) {
    return knex.schema.createTable('seasons', table => {
        table.increments('id').primary()
        table.string('year').notNull()
        table.date('start').notNull()
        table.date('end').notNull()
        table.string('current').notNull()
        table.integer('league_id').notNull()
        table.foreign('league_id').references('leagues.id')
        table.integer('fixture_events').notNull()
        table.integer('fixture_lineups').notNull()
        table.integer('fixture_statistics').notNull()
        table.integer('fixture_statistics_players').notNull()
        table.integer('standings').notNull()
        table.integer('players').notNull()
        table.integer('top_scorers').notNull()
        table.integer('predictions').notNull()
        table.integer('odds').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('seasons')
};
