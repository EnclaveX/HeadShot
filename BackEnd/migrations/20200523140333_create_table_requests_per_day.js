
exports.up = function (knex, Promise) {
    return knex.schema.createTable('requests_per_day', table => {
        table.increments('id').primary()
        table.string('day').notNull()
        table.string('url').notNull()
        table.integer('requests').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('requests_per_day')
};
