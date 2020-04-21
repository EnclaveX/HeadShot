exports.up = function (knex, Promise) {
    return knex.schema.alterTable('fixtures', table => {
        table.string('home_team_end_status')
        table.string('away_team_end_status')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('fixtures', table => {
        table.dropColumn('home_team_end_status')
        table.dropColumn('away_team_end_status')
    })
};
