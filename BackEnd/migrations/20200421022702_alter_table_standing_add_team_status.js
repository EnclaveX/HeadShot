exports.up = function (knex, Promise) {
    return knex.schema.alterTable('standings_per_round', table => {
        table.string('team_end_status')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('standings_per_round', table => {
        table.dropColumn('team_end_status')
    })
};
