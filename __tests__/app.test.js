const request = require("supertest");
const app = require("../app");
const testData = require("../db/data/test-data");
const knex = require("../connection");
const { forEach } = require("../db/data/test-data/comments");

describe("app", () => {
  afterAll(() => {
    return knex.destroy();
  });
  describe("/api", () => {
    describe("/topics", () => {
      test("GET: 200 - responds with an array of all topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            res.body.forEach((topic) => {
              expect("slug" in topic).toBe(true);
              expect("description" in topic).toBe(true);
            });
          });
      });
    });
  });
});
