exports.up = function (knex, Promise) {
    return knex.schema.alterTable('fixtures', table => {
        table.integer('round_number')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('fixtures', table => {
        table.dropColumn('round_number')
    })
};
