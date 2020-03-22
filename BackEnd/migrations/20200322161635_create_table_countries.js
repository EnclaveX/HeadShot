
exports.up = function (knex, Promise) {
    return knex.schema.createTable('countries', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('code').notNull().unique()
        table.string('flag').notNull()
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('countries')
};
