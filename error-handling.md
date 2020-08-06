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

- `Status: 404 - non existent path [SS - Done]`

### PATCH / PUT / POST / DELETE... `/api/articles` etc...

`- Status: 405 - error handler & testing implemented`

---

## Available Routes

### GET `/api/topics`

`- SS: What if no topics are returned? 204 - No content? [But, since our db is always seeded, this would be a problem with our server]`

### GET `/api/users/:username`

-`SS: User ID is a string that doesn't exist in the database - 404 - DONE` -`SS: User ID is in incorrect format (i.e. not a string) - No - not a problem, since an entry of 1 would simply be a tring of "1"`

### GET `/api/articles/:article_id`

- `Bad article_id (e.g. /dog) - [SS: 400; psql error]`
- `Well formed article_id that doesn't exist in the database (e.g. /999999) [SS: 404 not found]`

### PATCH `/api/articles/:article_id`

- `` No `inc_votes` on request body [SS: patch method makes no sense without this; 400 (causes a psql error)] ``
  `` - Invalid `inc_votes` (e.g. `{ inc_votes : "cat" }`) [400 As above] ``
  `- Some other property on request body (e.g.{ inc_votes : 1, name: 'Mitch' }) [SS: we definitely don't want this to be updated! We could either reject it, or ignore it. To me, it feels better to reject it, otherwise we will be telling people they have been successful, when half of their request has been ignored. So, 400] Jim's view is it might better to ignore, since this would be more flexible for future scalability - implemented this now, status 201.`
  `- [SS: What if the increment takes the number of votes below zero?? talked to jim - Commonly you can upvote and downvote anyway!]`

### POST `/api/articles/:article_id/comments`

`[SS: - bad article id (e.g. dog) - 400]`
`[SS: - well formed article id but doesnt exist- 404]`
`[SS: - User doesn't exist - 404`
`[SS: no body is sent] - 400`

### GET `/api/articles/:article_id/comments`

`[SS: - bad article id (e.g. dog) - 400]`
`[SS: - well formed article id but doesnt exist- 404] - this needs a custom error.`
`No comments found for an article that exists - not a problem.`

### GET `/api/articles`

- Bad queries:
  `- sort_by a column that doesn't exist [SS: 400 - done]`
  `- order !== "asc" / "desc" [SS: 400 - done]`
  `- author / topic that is not in the database [SS: 400 - done]`
  `- author / topic that exists but does not have any articles associated with it [SS: From speaking to Jim, this should be a 200- done]`

### PATCH `/api/comments/:comment_id`

`- No inc_votes on request body [SS: patch method makes no sense without this; 400 (causes a psql error)]`
`- Invalid inc_votes (e.g. { inc_votes : "cat" }) [400 As above]`
`- Some other property on request body (e.g.{ inc_votes : 1, name: 'Mitch' }) [SS: we definitely don't want this to be updated! We could either reject it, or ignore it. To me, it feels better to reject it, otherwise we will be telling people they have been successful, when half of their request has been ignored. So, 400] Jim's view is it might better to ignore, since this would be more flexible for future scalability.`
`[SS: -Invalid comment id - badly formed (400)]`
`[SS: -Invalid comment id - non-existant Should be a 404 error .`

### DELETE `/api/comments/:comment_id`

`-SS: Comment id well formed but doesnt exist [404]`
`-SS: Comment id badly formed [400]`

### GET `/api`

`-SS: Invalid methods [405]`
