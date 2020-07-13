
exports.up = async function(knex) {
  await knex.schema.createTable("users", tbl => {
      tbl.increments()
      tbl.text("username").unique().notNull()
      tbl.text("password").notNull()
      tbl.text("department")
  })
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("users")
};
