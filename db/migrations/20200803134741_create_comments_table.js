exports.up = function (knex) {
  // console.log("creating comments table");
  return knex.schema.createTable("comments", (commentsTable) => {
    commentsTable.increments("comment_id");
    commentsTable.string("author").references("users.username");
    commentsTable.integer("article_id").references("articles.article_id");
    commentsTable.integer("votes").defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.string("body", 1000).notNullable();
  });
};

exports.down = function (knex) {
  // console.log("dropping comments table");
  return knex.schema.dropTable("comments");
};
