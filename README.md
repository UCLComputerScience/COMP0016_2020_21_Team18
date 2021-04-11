# Grace Chatbot

Grace Chatbot, project designed to answer doctors questions about their patients using a chatbot app connected to neo4j database

## Technologies used

### Prerequisites
Node.JS (last stable version)
Docker (only if you want to use Docker way of running the project)

### Backend
Backend is developed using Node.JS, with Express framework handling the API side of the project.

### Frontend
Frontend is developed using HTML/CSS/JS and statically rendered using SSR.

### Launching the project
To launch the project fill out the .example.env file using your LUIS API key and production endpoint and your Neo4J database access data and rename it to .env, run `npm start` in the root directory, or use Dockerfile provided using command `docker build . -t grace && docker run --env-file=.env grace`.

### Code style
To maintain the quality of the code `ESLint` and `Prettier` are used as linter/formatters. To run them use `npm run lint`.

### Testing
We provide a comprehensive suite of unit, integration and E2E tests, to run unit and integration tests use command `npm run test:coverage` (coverage is provided using `Istanbul` library). To run E2E tests follow the steps:
1) Install Cypress using `npm install -g cypress`
2) Install Cypress executables using `cypress install`
3) Run command `npm run test:e2e`.

### Documentation
Code documentation is automatically generated using `JSDoc` and stored in `docs/out`. If there is a need to update the documentation command `npm run docs:generate` should be used.

## Structure

- .github - Github CI/CD files
- src - backend files
- public - frontend files
- docs/out - documentation