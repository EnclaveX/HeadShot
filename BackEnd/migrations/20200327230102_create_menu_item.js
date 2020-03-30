exports.up = function (knex, Promise) {
    return knex.schema.createTable('menu_items', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.integer('order').unsigned()
        table.integer('menu_id').notNull().unsigned()
        table.foreign('menu_id').references('menus.id')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('menu_items')
};
