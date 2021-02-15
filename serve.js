/* eslint-disable no-console, no-return-assign, no-unused-vars */

const chalk = require("chalk");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const app = express();
const port = process.env.port || 8000;
const MIN_DELAY_IN_MS = 10;
const MAX_DELAY_IN_MS = 3000;
const SUCCESS_THRESHOLD = 0.75; // I.e. 'Succeed ~75% of the time'

/**
 *
 * Prep some data
 *
 */

const data = require("./data.json");

const listOfFields = {
  fields: Object.keys(data).map((id) => ({
    id,
    name: data[id].name,
    type: data[id].type,
  })),
};

const listOfFieldIds = Object.keys(data);

/**
 * Keep track of the randomzied delay (or not) per response to log it
 * out later
 */
const responseDelay = () => {
  let delay = 0;

  return {
    set: (_delay) => (delay = _delay),
    get: () => delay,
  };
};

const delay = responseDelay();

/**
 *
 * Helpers (of course)
 *
 */

const iShouldRandomlyActUp = () => Math.random() >= SUCCESS_THRESHOLD;

const randomDelayInMilliSeconds = () =>
  Math.floor(
    Math.random() * (MAX_DELAY_IN_MS - MIN_DELAY_IN_MS) + MIN_DELAY_IN_MS
  );

const queryParamMiddleware = (req, res, next) => {
  delay.set("fast" in req.query ? 0 : randomDelayInMilliSeconds());

  if ("succeed" in req.query) {
    return setTimeout(() => next(), delay.get());
  }

  if (iShouldRandomlyActUp() || "fail" in req.query) {
    return setTimeout(
      () =>
        res.status(500).send({
          message: "I failed on a whim. I am capricious. That's how I roll.",
        }),
      delay.get()
    );
  }

  return setTimeout(() => next(), delay.get());
};

/**
 *
 * The Stack 🥞 😋
 *
 */

app.use(cors());

app.use(
  morgan(
    (tokens, req, res) => {
      const status = res.statusCode;
      const responseTime = tokens["response-time"](req, res);

      /**
       * In morgan, the response time is `undefined` if the
       * request/response cycle was completed _before_ anything was sent
       * (zero milliseconds wouldn't make sense.)
       */
      const responseChunk = responseTime
        ? `${responseTime}ms`
        : "(interrupted)";

      return [
        chalk.yellow(`[${tokens.date(req, res, "iso")}]`),
        chalk.blue(`${tokens.method(req, res)}`),
        tokens.url(req, res),
        status === 200 || status === 304
          ? chalk.green(status)
          : chalk.red(status),
        chalk.gray(`${responseChunk}`),
        delay.get() > 0 ? chalk.gray("(delayed)") : "",
      ].join(" ");
    },
    {
      skip: (req, res) => req.url === "/favicon.ico",
    }
  )
);

app.get("/", (_, res) =>
  res.send({
    message: "Why hello! Have you read the README?",
  })
);

app.use(queryParamMiddleware);

app.get("/fields", (req, res) => res.send(listOfFields));

app.get("/fields/:id", (req, res) => {
  const { id } = req.params;

  if (listOfFieldIds.indexOf(id) === -1) {
    return res.status(404).send({
      message: `Could not find a field with ID '${id}'`,
    });
  }

  return res.send({
    ...data[id],
    id,
  });
});

app.use((_, res) =>
  res.status(404).send({
    message: "Could not find that resource.",
  })
);

app.listen(port, () =>
  console.log(`🚀 The Fake Fields API is listening on port ${port}`)
);
