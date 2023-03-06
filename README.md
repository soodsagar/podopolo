# Notes App for Podopolo
[Backend Exercise]
This is a **Node/Express** application that uses **MongoDB** for data storage. The application has endpoints to create, read, update, and delete notes for authenticated users. The user authentication is done using **JSON Web Tokens** (JWT). The application also has rate limiting capability using a **Redis** cache layer. 

The app is far from perfect, but handles all requirements for this assessment. See the [Future Improvements](#future-improvements) section for some of my recommendations on how I could improve this app in the future. 


# Features
### Node/Express
The API is built with the Express framework. It was picked due to its easy of use, flexible and minimilistic framework for design an API in a fast and scalable manner. Express provides middleware, which are functions that can be executed before or after the request and response objects. In our case, we are using the Passport (3rd party library) middleware for authentication, and Redis rate limiting middleware. 

### MongoDB
MongoDB's flexible document-based data model allows for easy representation of complex data structures, such as notes that can contain text, images, and other media. The ability to store and retrieve nested data structures also makes MongoDB a good fit for a notes app where each note can have different fields and properties. Additionally, MongoDB is designed to scale horizontally across multiple servers, allowing for high availability and better performance. This is important for a notes app that could potentially have a large number of users and notes.

### Redis
The rate limiting feature is implement using Redis cache layer. This layer stores a count of requests made by a user based on their IP address. Every time a request is made, the counter increments, until it reaches it's maximum allowed request threshold, which then triggers the API to return a 429 - Too Many Requests response. There are plenty of 3rd party libraries available for rate limiting in a Node app, but for the sake of this assessment, I chose Redis and decided to implement custom logic. Additionally, with the potential of high amount of traffic, Redis layer can be scaled with it's distributed caching, which would allow to store and retrieve data across multiple nodes or servers.

### Jest
Jest is used for unit and integration testing. It's easy to setup with Node/Express, integrates well with our app's design structure. 

### Docker
Docker was used to run the service and its dependencies in containers. There are three containers; the Node/Express API, MongoDB and Redis. Each container is isolated from other containers and the host machine, which means that an issue in one container will not affect other containers or the host machine.  Additionally, for ease of use, the containers can be spun up and setup easily without configuring each component, which might also differ from environment to environment. 

## Security

The authentication system consists of a email/password flow. The `UserSchema.methods.setPassword()` method is a function that sets a password for a user in a Node.js application.
This function takes a `password` parameter as input, which is the plain text password entered by the user. It then generates a random `salt` value, which is used to strengthen the security of the password. The `pbkdf2Sync()` function is then used to create a hash of the password, using the `salt` value, 10000 iterations, a key length of 512, and the SHA512 algorithm. The resulting `hash` is then saved to the hash property of the UserSchema object. When the user logs in, it finds the user by email, and takes the password from request, cretes a hash and compares against the hash in the record. This way its always comparing the hashes, never the true password. 

This function is useful for security because it protects user passwords from being stored in plain text. Instead, it stores a hashed version of the password that cannot be reversed back to the original plain text password. Even the database owner cannot get access to real passwords. Additionally, the use of a random salt value and a large number of iterations makes it more difficult for attackers to crack the password using brute force attacks or rainbow tables. Overall, this function helps to ensure that user passwords are stored securely and cannot be easily compromised.

## Installation
### Requirements
* [Node](https://nodejs.org/en/download/)
  * this app was built on Node v16.18.1
* [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Docker](https://docs.docker.com/get-docker/)
* [Docker-compose](https://dockerlabs.collabnix.com/intermediate/workshop/DockerCompose/How_to_Install_Docker_Compose.html)
* [Jest](https://www.npmjs.com/package/jest)

### Install & Run
After installing the above requirements, follow the procedure below. 
```
cd podopolo
npm install
docker-compose up -d
```
Docker compose should setup and spin up three containers (node app, mongodb and redis).
Run `docker ps` to make sure all 3 services are running.

The API should now be exposed on port `4000`. You can access the API at `localhost:4000` or `http://127.0.01:4000`

### Install & Run
To run tests using Jest, run the following command:
```
npm test
OR
npm run test
```
## Endpoints
### Authentication

**Signup for a new account**
```
POST /api/auth/signup
```
Request
```
{
  "user": {
    "email": "hello@podopolo.com"
    "password": "pass123"
  }
}
```
Response
```
HTTP 200 OK

{
  "user": {
    "id": "00000000-0000-0000-0000-000000000000"
  }
}
```

**Log in to existing account**
```
POST /api/auth/login
```
Request
```
{
  "user": {
    "email": "hello@podopolo.com"
    "password": "pass123"
  }
}
```
Response
```
HTTP 200 OK

{
  "user": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjlkNTVlMDcwL.y04dsem1a22v6Gs"
  }
}
```

### Notes

**Create a new note**
```
POST /api/notes
Headers: { Authorization: "Bearer: YOUR_TOKEN" }
```
Request
```
{
  "note": {
    "content": "this is my fancy note"
  }
}
```
Response
```
HTTP 200 OK

{
  "note": [
    {
      "_id": "990559821166beed09bca5f5"
      "users": [
          "640559821166beed09bca5f4"
      ],
      "content": "this is my fancy note",
      "createdAt": "2023-03-06T03:10:27.616Z",
      "updatedAt": "2023-03-06T03:10:27.616Z"
    }
  ]
}
```

**Get all notes**
```
GET /api/notes
Headers: { Authorization: "Bearer: YOUR_TOKEN" }
```

Response
```
HTTP 200 OK

{
  "note": [
    {
      "_id": "990559821166beed09bca5f5"
      "users": [
          "640559821166beed09bca5f4"
      ],
      "content": "this is my fancy note",
      "createdAt": "2023-03-06T03:10:27.616Z",
      "updatedAt": "2023-03-06T03:10:27.616Z"
    }
  ]
}
```


**Get a single note by ID**
```
GET /api/notes/:id
Headers: { Authorization: "Bearer: YOUR_TOKEN" }
```

Response
```
HTTP 200 OK

{
  "note": [
    {
      "_id": "990559821166beed09bca5f5"
      "users": [
          "640559821166beed09bca5f4"
      ],
      "content": "this is my fancy note",
      "createdAt": "2023-03-06T03:10:27.616Z",
      "updatedAt": "2023-03-06T03:10:27.616Z"
    }
  ]
}
```


**Update an existing note by ID**
```
PUT /api/notes/:id
Headers: { Authorization: "Bearer: YOUR_TOKEN" }
```

Request
```
{
  "note": {
    "content": "this is my fancy UPDATED note"
  }
}
```

Response
```
HTTP 204 No Content
```

**Share an existing note with another user**
```
POST /api/notes/:id/share
Headers: { Authorization: "Bearer: YOUR_TOKEN" }
```
Request
```
{
  "user": {
    "id": "990559821166beed09bca5f4"
  }
}
```
Response
```
HTTP 204 No Content
```

**Search notes**
```
GET /api/search?content=YOUR_KEYWORD
Headers: { Authorization: "Bearer: YOUR_TOKEN" }
```
Request
```
{
  "note": {
    "id": "990559821166beed09bca5f4"
  }
}
```
Response
```
HTTP 200 OK

{
  "note": [
    {
      "_id": "990559821166beed09bca5f5"
      "users": [
          "640559821166beed09bca5f4"
      ],
      "content": "this is my fancy note",
      "createdAt": "2023-03-06T03:10:27.616Z",
      "updatedAt": "2023-03-06T03:10:27.616Z"
    }
  ]
}
```

**Delete a note**
```
DELETE /api/notes/:id
Headers: { Authorization: "Bearer: YOUR_TOKEN" }
```
Request
```
{
  "note": {
    "id": "20559821166beed09bca5f4"
  }
}
```
Response
```
HTTP 204 No Content
```

## Future Improvements

There are definitely a few things that I would like to improve in the future that can make this app more scalable, organized and efficient. 
* Use an internal ID system (like UUID) instead of MongoDB's default ObjectID. It would be slightly more secure, platform agnostic and assist with any potential future migrations.
* Better Jest global setup and teardown
* Encrypt  `content` field in `notes` collection. In real world, it's likely that users will store sensitive information in their notes, so it's vital to encrypt this field as well while still making it compatible with fast search functionality. 
* Encrypt `email` field in `users` collection as well, for GDPR compliance.
* Better middleware for HTTP error handling

