
exports.up = function (knex, Promise) {
    return knex.schema.createTable('standings', table => {
        table.integer('rank')
        table.integer('team_id').notNull()
        table.foreign('team_id').references('teams.id')
        table.integer('league_id').notNull()
        table.foreign('league_id').references('leagues.id')
        table.integer('season_id').notNull()
        table.foreign('season_id').references('seasons.id')
        table.integer('points')
        table.integer('goals_for')
        table.integer('goals_against')
        table.integer('goals_diff')
        table.integer('played')
        table.integer('win') 
        table.integer('draw')
        table.integer('lose')
        table.integer('home_goals_for')
        table.integer('home_goals_against')
        table.integer('home_played')
        table.integer('home_win')
        table.integer('home_draw')
        table.integer('home_lose')
        table.integer('away_goals_for')
        table.integer('away_goals_against')
        table.integer('away_played')
        table.integer('away_win')
        table.integer('away_draw')
        table.integer('away_lose')
        table.string('form')
        table.primary(['rank', 'league_id', 'season_id'])
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('standings')
};
