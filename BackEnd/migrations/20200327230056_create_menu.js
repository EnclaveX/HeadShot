
exports.up = function (knex, Promise) {
    return knex.schema.createTable('menus', table => {
        table.integer('id').primary()
        table.string('name').notNull()
        table.integer('order').notNull()
        table.string('icon').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('menus')
};
