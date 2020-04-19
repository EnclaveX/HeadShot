
exports.up = function (knex, Promise) {
    return knex.schema.createTable('fixtures', table => {
        table.integer('id').primary()
        table.string('venue')
        table.string('status')
        table.string('round')
        table.bigInteger('fixture_date')
        table.integer('extratime')
        table.integer('penalty')
        table.integer('league_id').notNull()
        table.foreign('league_id').references('leagues.id')
        table.integer('season_id').notNull()
        table.foreign('season_id').references('seasons.id')
        table.integer('team_home_id').notNull()
        table.foreign('team_home_id').references('teams.id')
        table.integer('home_fulltime_goals')
        table.integer('home_halftime_goals')
        table.integer('home_extratime_goals')
        table.integer('home_penalty_goals')
        table.integer('team_away_id').notNull()
        table.foreign('team_away_id').references('teams.id')
        table.integer('away_fulltime_goals')
        table.integer('away_halftime_goals')
        table.integer('away_extratime_goals')
        table.integer('away_penalty_goals')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('fixtures')
};
