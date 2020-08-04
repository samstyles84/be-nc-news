const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const knex = require("../connection");
const { forEach } = require("../db/data/test-data/comments");

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
      test("GET: 200 - responds with an array of article objects with correct keys", () => {
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
      test("GET: 200 - comment_count is correct", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].comment_count).toBe(13);
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
      test("GET: 200 - array can be filtered by author", () => {
        return request(app)
          .get("/api/articles?author=rogersop")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article.author).toBe("rogersop");
            });
          });
      });
      test("GET: 200 - array can be filtered by topic", () => {
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
            expect(msg).toBe("bad request!!!");
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
      test("GET: 400 - author/topic not in db", () => {
        return request(app)
          .get("/api/articles?author=samstyles")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "author/topic not found in db, or no articles found!!!"
            );
          });
      });
      test("GET: 404 - author / topic exists but no articles associated", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "author/topic not found in db, or no articles found!!!"
            );
          });
      });
    });
  });
});

/*
- Bad queries:
  - `author` / `topic` that exists but does not have any articles associated with it
*/
