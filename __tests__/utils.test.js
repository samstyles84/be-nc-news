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

describe("makeRefObj", () => {});

/*
This utility function should be able to take an array (`list`) of objects and return a reference object. The reference object must be keyed by each item's title, with the values being each item's corresponding id. e.g.

`[{ article_id: 1, title: 'A' }]`

will become

`{ A: 1 }`
*/

describe("formatComments", () => {});

/*
This utility function should be able to take an array of comment objects (`comments`) and a reference object, and return a new array of formatted comments.
Each formatted comment must have:
- Its `created_by` property renamed to an `author` key
- Its `belongs_to` property renamed to an `article_id` key
- The value of the new `article_id` key must be the id corresponding to the original title value provided
- Its `created_at` value converted into a javascript date object
- The rest of the comment's properties must be maintained
*/
