const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const knex = require("../connection");

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
    });
    describe("/users/:username", () => {
      test("GET: 200 - responds with a user object with corerct username, avatar & name", () => {
        const testUser = testData.userData[0];
        const apiString = `/api/users/${testUser.username}`;
        return request(app)
          .get(apiString)
          .expect(200)
          .then(({ body: { user } }) => {
            //Note the nested destructuring here
            expect(user.username).toBe(testUser.username);
            expect(user.avatar_url).toBe(testUser.avatar_url);
            expect(user.name).toBe(testUser.name);
          });

        //Maybe not a great idea to require in the testData - someone reading the tests doesnt nkow what to expect.
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
      test("GET: 200 - array can be sorted by other columns and in ascending order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", { descending: false });
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
      test("GET: 400 - topic not in db", () => {
        return request(app)
          .get("/api/articles?topic=samstyles")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("topic not found in db!!!");
          });
      });
      test("GET: 400 - author not in db", () => {
        return request(app)
          .get("/api/articles?author=samstyles")
          .expect(400)
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
        test("PATCH: 201 - update vote count of an article", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(201)
            .send({ inc_votes: 42 })
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
        test("PATCH: 400 - No `inc_votes` on request body", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("PATCH: 400 - Invalid `inc_votes", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .send({ inc_votes: "cat" })
            .then(({ body: { msg } }) => {
              expect(msg).toBe("bad request to db!!!");
            });
        });
        test("PATCH: 400 - Some other property on request body", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .send({ inc_votes: 1, name: "Mitch" })
            .then(({ body: { msg } }) => {
              expect(msg).toBe("invalid patch parameter!!!");
            });
        });
      });
    });
  });
});
