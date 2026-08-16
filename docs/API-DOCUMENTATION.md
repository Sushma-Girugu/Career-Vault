# CareerVault API Documentation

## Base URL

http://localhost:5000

## Profile APIs

### Save Profile

POST /api/profile

Request body:

{
  "name": "John",
  "email": "john@example.com",
  "college": "ABC College",
  "branch": "CSE",
  "year": "3"
}

### Get Profiles

GET /api/profile

Returns stored profile records.

## Skills APIs

### Add Skill

POST /api/skills

Request body:

{
  "name": "JavaScript",
  "level": "Intermediate"
}

### Get Skills

GET /api/skills

Returns all stored skills.

### Delete Skill

DELETE /api/skills/:id

Deletes a skill using its MongoDB ID.

## Test API

GET /api/test

Response:

{
  "message": "API is working"
}
