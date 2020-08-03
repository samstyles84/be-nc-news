const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  test("Returns a new array", () => {
    const input = [];
    const output = formatDates(input);
    expect(Array.isArray(output)).toBe(true);
    expect(output).not.toBe(input);
  });
  test("Returns new objects within array", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const output = formatDates(input);
    expect(output[0]).not.toBe(input[0]);
  });
  test("Returns a date instance", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const output = formatDates(input);
    expect(output[0].created_at).toBeInstanceOf(Date);
  });
  test("Maintains other properties", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const output = formatDates(input);
    expect(output[0].body).toEqual(input[0].body);
    expect(output[0].belongs_to).toEqual(input[0].belongs_to);
    expect(output[0].created_by).toEqual(input[0].created_by);
    expect(output[0].votes).toEqual(input[0].votes);
  });
  test("Works with multiple entries from different table", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ];
    const output = formatDates(input);
    expect(output[0].topic).toEqual(input[0].topic);
    expect(output[0].author).toEqual(input[0].author);
    expect(output[1].topic).toEqual(input[1].topic);
    expect(output[1].author).toEqual(input[1].author);
    expect(output[0].created_at).toBeInstanceOf(Date);
    expect(output[1].created_at).toBeInstanceOf(Date);
  });
  test("Does not mutate original", () => {
    const input = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ];
    const output = formatDates(input);
    expect(input).toEqual([
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
    ]);
  });
});

describe("makeRefObj", () => {
  test("Returns a new object", () => {
    const input = [{ article_id: 1, title: "A" }];
    const output = makeRefObj(input);
    expect(typeof output).toBe("object");
    expect(output).not.toBe(input);
  });
  test("Returns a reference for a single item", () => {
    const input = [{ article_id: 1, title: "A" }];
    const output = makeRefObj(input);
    expect(output).toEqual({ A: 1 });
  });
  test("Returns a reference for multiple items", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
    ];
    const output = makeRefObj(input);
    expect(output).toEqual({ A: 1, B: 2 });
  });
  test("Does not mutate original", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
    ];
    const output = makeRefObj(input);
    expect(input).toEqual([
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
    ]);
  });
});

/*
This utility function should be able to take an array (`list`) of objects and return a reference object. The reference object must be keyed by each item's title, with the values being each item's corresponding id. e.g.
`[{ article_id: 1, title: 'A' }]`
will become
`{ A: 1 }`
*/

describe("formatComments", () => {
  test("Returns a new array", () => {
    const inputComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const articleRef = { A: 1 };
    const output = formatComments(inputComments, articleRef);
    expect(Array.isArray(output)).toBe(true);
    expect(output).not.toBe(inputComments);
    expect(output[0]).not.toBe(inputComments[0]);
  });
  test("Returns an array containing object with the correct properties", () => {
    const inputComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const articleRef = { A: 1 };
    const output = formatComments(inputComments, articleRef);
    expect("author" in output[0]).toBe(true);
    expect("article_id" in output[0]).toBe(true);
    expect(output[0].created_at).toBeInstanceOf(Date);
    expect("article_id" in output[0]).toBe(true);
    expect("created_by" in output[0]).toBe(false);
    expect("belongs_to" in output[0]).toBe(false);
    expect("body" in output[0]).toBe(true);
    expect("votes" in output[0]).toBe(true);
  });
  test("Works on multiple comments", () => {
    const inputComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "B",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "AAAAAA",
        belongs_to: "A",
        created_by: "alpha",
        votes: 1,
        created_at: 1411354163389,
      },
    ];
    const articleRef = { A: 1, B: 2 };
    const output = formatComments(inputComments, articleRef);

    expect(output[0].article_id).toBe(2);
    expect(output[1].article_id).toBe(1);
    output.forEach((comment) => {
      expect("author" in comment).toBe(true);
      expect("article_id" in comment).toBe(true);
      expect(comment.created_at).toBeInstanceOf(Date);
      expect("article_id" in comment).toBe(true);
      expect("created_by" in comment).toBe(false);
      expect("belongs_to" in comment).toBe(false);
      expect("body" in comment).toBe(true);
      expect("votes" in comment).toBe(true);
    });
  });
  test("Doesn't mutate original", () => {
    const inputComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "B",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "AAAAAA",
        belongs_to: "A",
        created_by: "alpha",
        votes: 1,
        created_at: 1411354163389,
      },
    ];
    const articleRef = { A: 1, B: 2 };
    const output = formatComments(inputComments, articleRef);
    expect(inputComments).toEqual([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "B",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body: "AAAAAA",
        belongs_to: "A",
        created_by: "alpha",
        votes: 1,
        created_at: 1411354163389,
      },
    ]);
    expect(articleRef).toEqual({ A: 1, B: 2 });
  });
});

/*
This utility function should be able to take an array of comment objects (`comments`) and a reference object, and return a new array of formatted comments.
Each formatted comment must have:
- Its `created_by` property renamed to an `author` key
- Its `belongs_to` property renamed to an `article_id` key
- The value of the new `article_id` key must be the id corresponding to the original title value provided
- Its `created_at` value converted into a javascript date object
- The rest of the comment's properties must be maintained
*/
