const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const knex = require("../connection");
const { forEach } = require("../db/data/test-data/users");

describe("app", () => {
  beforeEach(() => {
    return knex.seed.run();
  });

  afterAll(() => {
    return knex.destroy();
  });

  test("ALL: 404 - non existent path", () => {
    return request(app)
      .get("/not-a-route")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found! :-(");
      });
  });

  describe("/api", () => {
    test("GET: 200 - responds with a JSON object describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.objectContaining({
              "GET /api": expect.any(Object),
              "GET /api/topics": expect.any(Object),
              "GET /api/users/:username": expect.any(Object),
              "GET /api/articles": expect.any(Object),
              "GET /api/articles/:article_id": expect.any(Object),
              "PATCH /api/articles/:article_id": expect.any(Object),
              "POST /api/articles/:article_id/comments": expect.any(Object),
              "GET /api/articles/:article_id/comments": expect.any(Object),
              "PATCH /api/comments/:comment_id": expect.any(Object),
              "DELETE /api/comments/:comment_id": expect.any(Object),
            })
          );
        });
    });
    test("INVALID METHODS: 405 error", () => {
      const invalidMethods = ["put", "post", "patch", "delete"];
      const endPoint = "/api";

      const promises = invalidMethods.map((method) => {
        return request(app)
          [method](endPoint)
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("method not allowed!!!");
          });
      });
      return Promise.all(promises);
    });
    describe("/topics", () => {
      test("GET: 200 - responds with an array of all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                }),
              ])
            );
          });
      });
      test("INVALID METHODS: 405 error", () => {
        const invalidMethods = ["put", "post", "patch", "delete"];
        const endPoint = "/api/topics";

        const promises = invalidMethods.map((method) => {
          return request(app)
            [method](endPoint)
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed!!!");
            });
        });
        return Promise.all(promises);
      });
    });
    describe("/users/:username", () => {
      test("GET: 200 - responds with a user object with corerct username, avatar & name", () => {
        const testUser = testData.userData[0];
        const apiString = `/api/users/${testUser.username}`;
        return request(app)
          .get(apiString)
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user.username).toBe(testUser.username);
            expect(user.avatar_url).toBe(testUser.avatar_url);
            expect(user.name).toBe(testUser.name);
          });
      });
      test("GET: 404 - Username doesn't exist in the database", () => {
        const apiString = `/api/users/samstyles`;
        return request(app)
          .get(apiString)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("username not found");
          });
      });
      test("INVALID METHODS: 405 error", () => {
        const invalidMethods = ["put", "post", "patch", "delete"];
        const endPoint = "/api/users/butter_bridge";

        const promises = invalidMethods.map((method) => {
          return request(app)
            [method](endPoint)
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed!!!");
            });
        });
        return Promise.all(promises);
      });
    });
    describe("/articles", () => {
      test("GET: 200 - responds with an array of article objects with correct properties", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  votes: expect.any(Number),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  comment_count: expect.any(Number),
                }),
              ])
            );
          });
      });
      test("GET: 200 - responds with an array of all article objects ", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(12);
          });
      });
      test("GET: 200 - array is sorted by date in descending order as default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("GET: 200 - comment_count & other values is correct", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].comment_count).toBe(13);
            expect(articles[0].article_id).toBe(1);
            expect(articles[0].title).toBe(
              "Living in the shadow of a great man"
            );
            expect(articles[0].votes).toBe(100);
            expect(articles[0].topic).toBe("mitch");
            expect(articles[0].author).toBe("butter_bridge");
            expect(articles[0].created_at).toBe("2018-11-15T12:21:54.171Z");
          });
      });
      test("GET: 200 - array can be sorted by votes and in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", { descending: false });
          });
      });
      test("GET: 200 - array can be sorted by comment_count and in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("comment_count", {
              descending: false,
            });
          });
      });
      test("GET: 200 - endpoint can be queried by author", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article.author).toBe("rogersop");
            });
          });
      });
      test("GET: 200 - endpoint can be queried by topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article.topic).toBe("cats");
            });
          });
      });
      test("GET: 400 - sort_by column doesn't exist", () => {
        return request(app)
          .get("/api/articles?sort_by=streetcred")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request to db!!!");
          });
      });
      test("GET: 400 - order not asc or desc", () => {
        return request(app)
          .get("/api/articles?order=besttoworst")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("invalid sort order!!!");
          });
      });
      test("GET: 404 - topic not in db", () => {
        return request(app)
          .get("/api/articles?topic=samstyles")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("topic not found in db!!!");
          });
      });
      test("GET: 404 - author not in db", () => {
        return request(app)
          .get("/api/articles?author=samstyles")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("author not found in db!!!");
          });
      });
      test("GET: 200 - author / topic exists but no articles associated", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(0);
          });
      });
      test("INVALID METHODS: 405 error", () => {
        const invalidMethods = ["put", "post", "patch", "delete"];
        const endPoint = "/api/articles";

        const promises = invalidMethods.map((method) => {
          return request(app)
            [method](endPoint)
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed!!!");
            });
        });
        return Promise.all(promises);
      });

      describe("/articles/:article_id", () => {
        test("GET: 200 - returns an article object with the correct properties", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  body: expect.any(String),
                  votes: expect.any(Number),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  comment_count: expect.any(Number),
                })
              );
            });
        });
        test("GET: 200 - comment_count & article_id are correct; ", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.comment_count).toBe(13);
              expect(article.article_id).toBe(1);
              expect(article.title).toBe("Living in the shadow of a great man");
              expect(article.votes).toBe(100);
              expect(article.topic).toBe("mitch");
              expect(article.author).toBe("butter_bridge");
              expect(article.created_at).toBe("2018-11-15T12:21:54.171Z");
            });
        });
        test("GET: 400 - bad article_id", () => {
          return request(app)
            .get("/api/articles/dog")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("GET: 404 - Well formed article_id that doesn't exist in the database", () => {
          return request(app)
            .get("/api/articles/999999")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article not found!!!");
            });
        });
        test("PATCH: 200 - update vote count of an article", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 42 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.comment_count).toBe(13);
              expect(article.article_id).toBe(1);
              expect(article.title).toBe("Living in the shadow of a great man");
              expect(article.votes).toBe(142);
              expect(article.topic).toBe("mitch");
              expect(article.author).toBe("butter_bridge");
              expect(article.created_at).toBe("2018-11-15T12:21:54.171Z");
            });
        });
        test("PATCH: 200 - No `inc_votes` on request body", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.comment_count).toBe(13);
              expect(article.article_id).toBe(1);
              expect(article.title).toBe("Living in the shadow of a great man");
              expect(article.votes).toBe(100);
              expect(article.topic).toBe("mitch");
              expect(article.author).toBe("butter_bridge");
              expect(article.created_at).toBe("2018-11-15T12:21:54.171Z");
            });
        });
        test("PATCH: 400 - Invalid `inc_votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("PATCH: 200 - Some other property on request body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 42, name: "Mitch" })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.comment_count).toBe(13);
              expect(article.article_id).toBe(1);
              expect(article.title).toBe("Living in the shadow of a great man");
              expect(article.votes).toBe(142);
              expect(article.topic).toBe("mitch");
              expect(article.author).toBe("butter_bridge");
              expect(article.created_at).toBe("2018-11-15T12:21:54.171Z");
            });
        });
        test("PATCH: 404 - Well formed article_id that doesn't exist in the database", () => {
          return request(app)
            .patch("/api/articles/999999")
            .send({ inc_votes: 42 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("article not found!!!");
            });
        });
        test("INVALID METHODS: 405 error", () => {
          const invalidMethods = ["put", "post", "delete"];
          const endPoint = "/api/articles/1";

          const promises = invalidMethods.map((method) => {
            return request(app)
              [method](endPoint)
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("method not allowed!!!");
              });
          });
          return Promise.all(promises);
        });
        describe("/articles/:article_id/comments", () => {
          test("POST: 201 - post a comment and returns it", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "testing the POST endpoint",
              })
              .expect(201)
              .then(
                ({
                  body: {
                    comment: { author, body, article_id, votes, created_at },
                  },
                }) => {
                  expect(author).toBe("butter_bridge");
                  expect(body).toBe("testing the POST endpoint");
                  expect(article_id).toBe(1);
                  expect(votes).toBe(0);
                  expect(typeof created_at).toBe("string");
                }
              );
          });
          test("POST: 400 - bad article_id", () => {
            return request(app)
              .post("/api/articles/dog/comments")
              .send({
                username: "butter_bridge",
                body: "testing the POST endpoint",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("POST: 400 - Bad Request status code when `POST` request does not include all the required keys", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
                body: "testing the POST endpoint",
              })
              .expect(201)
              .then(
                ({
                  body: {
                    comment: { author, body, article_id, votes, created_at },
                  },
                }) => {
                  expect(author).toBe("butter_bridge");
                  expect(article_id).toBe(1);
                  expect(votes).toBe(0);
                  expect(typeof created_at).toBe("string");
                }
              );
          });
          test("POST: 404 - Well formed article_id that doesn't exist in the database", () => {
            return request(app)
              .post("/api/articles/999999/comments")
              .send({
                username: "butter_bridge",
                body: "testing the POST endpoint",
              })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("article not found in db!!!");
              });
          });
          test("POST: 422 - User_id that doesn't exist in the database", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "samstyles",
                body: "testing the POST endpoint",
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("request could not be processed in db!!!");
              });
          });
          test("POST: 400 - no body is sent", () => {
            return request(app)
              .post("/api/articles/1/comments")
              .send({
                username: "butter_bridge",
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("GET: 200 - responds with an array of comment objects with correct properties", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toEqual(
                  expect.arrayContaining([
                    expect.objectContaining({
                      comment_id: expect.any(Number),
                      votes: expect.any(Number),
                      author: expect.any(String),
                      created_at: expect.any(String),
                      body: expect.any(String),
                    }),
                  ])
                );
              });
          });
          test("GET: 200 - array is sorted by date in descending order as default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", {
                  descending: true,
                });
              });
          });
          test("GET: 200 - array can be sorted by other columns in asc order", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes&order=asc")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("votes", {
                  descending: false,
                });
              });
          });
          test("GET: 200 - array contains only correct no of articles for article_id & correct properties", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes&order=asc")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).toBe(13);
                expect(comments[0].comment_id).toBe(4);
                expect(comments[0].author).toBe("icellusedkars");
                expect(comments[0].votes).toBe(-100);
                expect(comments[0].body).toBe(
                  " I carry a log — yes. Is it funny to you? It is not to me."
                );
              });
          });
          test("GET: 200 - returns empty array for an article with no comments", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).toBe(0);
              });
          });

          test("GET: 400 - bad article_id", () => {
            return request(app)
              .get("/api/articles/dog/comments")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("bad request to db!!!");
              });
          });
          test("GET: 404 - Well formed article_id that doesn't exist in the database", () => {
            return request(app)
              .get("/api/articles/999999/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("article not found in db!!!");
              });
          });
          test("INVALID METHODS: 405 error", () => {
            const invalidMethods = ["put", "patch", "delete"];
            const endPoint = "/api/articles/1/comments";

            const promises = invalidMethods.map((method) => {
              return request(app)
                [method](endPoint)
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe("method not allowed!!!");
                });
            });
            return Promise.all(promises);
          });
        });
      });
    });
    describe("/comments/:comment_id", () => {
      test("PATCH: 200 - returns an updated comment object", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 42 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.comment_id).toBe(1);
            expect(comment.votes).toBe(58);
            expect(comment.author).toBe("butter_bridge");
            expect(comment.body).toBe(
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            );
          });
      });
      test("PATCH: 200 - No `inc_votes` on request body", () => {
        return request(app)
          .patch("/api/comments/1")
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.comment_id).toBe(1);
            expect(comment.votes).toBe(16);
            expect(comment.author).toBe("butter_bridge");
            expect(comment.body).toBe(
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            );
          });
      });
      test("PATCH: 400 - Invalid `inc_votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "cat" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request to db!!!");
          });
      });
      test("PATCH: 200 - Some other property on request body", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1, name: "Mitch" })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.comment_id).toBe(1);
            expect(comment.votes).toBe(17);
            expect(comment.author).toBe("butter_bridge");
            expect(comment.body).toBe(
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            );
          });
      });
      test("PATCH: 400 - bad comment_id", () => {
        return request(app)
          .patch("/api/comments/dog")
          .send({ inc_votes: 42 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request to db!!!");
          });
      });
      test("PATCH: 404 - Well formed comment_id that doesn't exist in the database", () => {
        return request(app)
          .patch("/api/comments/999999")
          .send({ inc_votes: 42 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("non-existant comment id!!!");
          });
      });
      test("DELETE: 204 - Deletes a comment from the database", () => {
        return request(app)
          .delete("/api/comments/2") //This is a comment on article 1
          .expect(204)
          .then(() => {
            return request(app).get("/api/articles/1/comments");
          })
          .then(({ body: { comments } }) => {
            expect(comments.every((comment) => comment.comment_id !== 2)).toBe(
              true
            );
          });
      });
      test("DELETE: 204 - Deletes a comment from the database", () => {
        return request(app)
          .delete("/api/comments/2") //This is a comment on article 1
          .expect(204)
          .then(() => {
            return request(app).get("/api/articles/1/comments");
          })
          .then(({ body: { comments } }) => {
            expect(comments.every((comment) => comment.comment_id !== 2)).toBe(
              true
            );
          });
      });
      test("DELETE: 404 - well formed id but comment not in the database", () => {
        return request(app)
          .delete("/api/comments/999999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Comment not found in db!!!");
          });
      });
      test("DELETE: 400 - badly formed id ", () => {
        return request(app)
          .delete("/api/comments/dog")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("bad request to db!!!");
          });
      });
      test("INVALID METHODS: 405 error", () => {
        const invalidMethods = ["put", "post", "get"];
        const endPoint = "/api/comments/1";

        const promises = invalidMethods.map((method) => {
          return request(app)
            [method](endPoint)
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("method not allowed!!!");
            });
        });
        return Promise.all(promises);
      });
    });
  });
});
