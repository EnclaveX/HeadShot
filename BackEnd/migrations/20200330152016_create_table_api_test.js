exports.up = function (knex, Promise) {
    return knex.schema.createTable('api_test', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.text('resp', 'longtext').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('api_test')
};
