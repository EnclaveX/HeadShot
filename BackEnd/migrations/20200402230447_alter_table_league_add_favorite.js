exports.up = function (knex, Promise) {
    return knex.schema.alterTable('leagues', table => {
        table.integer('favorite')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('leagues', table => {
        table.dropColumn('favorite')
    })
};
