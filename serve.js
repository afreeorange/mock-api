/* eslint-disable no-console */

const express = require('express');
const cors = require('cors');
const data = require('./data.json');

const app = express();
const port = process.env.port || 3000;
const MIN_DELAY_IN_MS = 10;
const MAX_DELAY_IN_MS = 3000;
const SUCCESS_THRESHOLD = 0.75; // I.e. "Succeed ~75% of the time"

/**
 *
 * Prep some data
 *
 */

const listOfFields = {
  fields: Object.keys(data).map((id) => ({
    id,
    name: data[id].name,
    type: data[id].type,
  })),
};

const listOfFieldIds = Object.keys(data);

/**
 *
 * Helpers (of course)
 *
 */

const iShouldRandomlyActUp = () => Math.random() >= SUCCESS_THRESHOLD;

const randomDelayInMilliSeconds = () => Math.floor(
  Math.random() * (MAX_DELAY_IN_MS - MIN_DELAY_IN_MS) + MIN_DELAY_IN_MS,
);

const timestamp = () => (new Date()).toISOString();

const queryParamMiddleware = (req, res, next) => {
  const responseDelay = 'fast' in req.query ? 0 : randomDelayInMilliSeconds();

  if (responseDelay > 0) {
    console.warn(`${timestamp()}: ⚠️  Delaying response by ${responseDelay}ms`);
  }

  if ('succeed' in req.query) {
    return setTimeout(() => next(), responseDelay);
  }

  if (iShouldRandomlyActUp() || 'fail' in req.query) {
    return setTimeout(
      () => res.status(500).send({
        message: 'I failed on a whim. I am capricious. That\'s how I roll.',
      }),
      responseDelay,
    );
  }

  return setTimeout(() => next(), responseDelay);
};

/**
 *
 * The Stack  🥞 😋
 *
 */

app.use(cors());

app.get('/', (_, res) => res.send('Why hello! Have you read the README?'));

app.use(queryParamMiddleware);

app.get('/fields', (req, res) => res.send(listOfFields));

app.get('/fields/:id', (req, res) => {
  const { id } = req.params;

  if (listOfFieldIds.indexOf(id) === -1) {
    return res.status(404).send({
      message: `Could not find a field with ID '${id}'`,
    });
  }

  return res.send(data[id]);
});

app.use((_, res) => res.status(404).send({
  message: 'Could not find that resource.',
}));

app.listen(port, () => console.log(
  `${timestamp()}: 🚀 The Fake Fields API is listening on port ${port}`,
));
