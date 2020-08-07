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
    expect(output[0]).not.toBe({
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: "butter_bridge",
      votes: 16,
      created_at: 1511354163389,
    });
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
    expect(output[0].body).toBe(
      "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
    );
    expect(output[0].belongs_to).toBe("They're not exactly dogs, are they?");
    expect(output[0].created_by).toBe("butter_bridge");
    expect(output[0].votes).toBe(16);
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
    formatDates(input);
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
