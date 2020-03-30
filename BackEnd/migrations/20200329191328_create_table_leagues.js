exports.up = function (knex, Promise) {
    return knex.schema.createTable('leagues', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('type').notNull()
        table.string('logo').notNull()
        table.integer('country_id').notNull()
        table.foreign('country_id').references('countries.id')
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('leagues')
};
