Run tests:

npm i
npm run test:unit
npm run test:e2e

Note: e2e overrides LabResultsService with an in-memory fake to avoid needing Redis/Mongo.
