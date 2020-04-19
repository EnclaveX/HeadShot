
exports.up = function (knex, Promise) {
    return knex.schema.createTable('teams', table => {
        table.integer('id').primary()
        table.string('name').notNull()
        table.string('logo').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('teams')
};
