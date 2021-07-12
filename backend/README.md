# Backend

 Express.js REST API with Mongoose


- run -> secret-server/backend/bin/development.sh to start dev server in docker-compose
- run -> secret-server/backend/bin/test.sh to run e2e tests in an isolated environment

this app was generated with the following boilerplate: 
https://github.com/kunalkapadia/express-mongoose-es6-rest-api


## [development]

### install all the dependencies

```npm install```

### change .env file configuration as needed

- NODE_ENV=development
- PORT=4040 
- MONGO_HOST=mongodb://localhost/optimonk-test-development
- MONGO_PORT=27017

### to start the server run

```npm run start:debug```

## [project structure]

### [secret module https://github.com/ewol123/secret-server/tree/master/backend/server/secret]
This is the main part of the application, dealing with the secrets itself. It's built with different layers, namely:
- ***[route]*** -- This layer is reponsible for mapping http requests to controllers, also input validation with a Joi middleware.
- ***[controller]*** -- This layer is responsible for passing request parameters to services and calling them. Also handles responses, and errors.
- ***[service]*** -- This layer implements the business logic, calls the persistence layer, and orchestrates different kinds of modules needed to work together.
- ***[model]*** -- This is the persistence layer with mongoose. Implements database entities, and exposes statics for database operations. For more complex use-cases it  might be beneficial to use a repository layer instead of statics. :)
