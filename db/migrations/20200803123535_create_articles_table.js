exports.up = function (knex) {
  console.log("creating articles table");
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id");
    articlesTable.string("title");
    articlesTable.string("body");
    articlesTable.integer("votes").defaultTo(0);
  });
};

exports.down = function (knex) {
  console.log("dropping articles table");
  return knex.schema.dropTable("articles");
};
