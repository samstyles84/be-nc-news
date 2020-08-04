# Possible Errors

This is an incomplete guide to the possible errors that may happen in your app. It is designed to prompt you to think about the errors that could occur as a client uses each endpoint that you have created.

Think about what could go wrong for each route, and the HTTP status code should be sent to the client in each case.
For each thing that could go wrong, make a test with your expected status code and then make sure that possibility is handled.

Bear in mind, handling bad inputs from clients doesn't necessarily have to lead to a 4\*\* status code. Handling can include using default behaviours or even ignoring parts of the request.

---

## Relevant HTTP Status Codes

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 404 Not Found
- 405 Method Not Allowed
- 418 I'm a teapot
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## The Express Documentation

[The Express Docs](https://expressjs.com/en/guide/error-handling.html) have a great section all about handling errors in Express.

## Unavailable Routes

### GET `/not-a-route`

- Status: 404 - non existent path [SS - Done]

### PATCH / PUT / POST / DELETE... `/api/articles` etc...

- Status:

---

## Available Routes

### GET `/api/topics`

- SS: What if no topics are returned? 204 - No content? [But, since our db is always seeded, this would be a problem with our server - review under 500 errors]

### GET `/api/users/:username`

-SS: User ID is a string that doesn't exist in the database - 404
-SS: User ID is in incorrect format (i.e. not a string) - No - not a problem, since an entry of 1 would simply be a tring of "1"

### GET `/api/articles/:article_id`

- Bad `article_id` (e.g. `/dog`)
- Well formed `article_id` that doesn't exist in the database (e.g. `/999999`)

### PATCH `/api/articles/:article_id`

- No `inc_votes` on request body
- Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`)
- Some other property on request body (e.g. `{ inc_votes : 1, name: 'Mitch' }`)

### POST `/api/articles/:article_id/comments`

-

### GET `/api/articles/:article_id/comments`

-

### GET `/api/articles`

- Bad queries:
  - `sort_by` a column that doesn't exist [SS: 400 - done]
  - `order` !== "asc" / "desc" [SS: 400 - done]
  - `author` / `topic` that is not in the database [SS: 400 - done (but currently combined with below)]
  - `author` / `topic` that exists but does not have any articles associated with it [SS: From speaking to Jim, this should be a 200- done]

### PATCH `/api/comments/:comment_id`

-

### DELETE `/api/comments/:comment_id`

-

### GET `/api`

-
