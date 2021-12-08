- [Hi there! 👋](#hi-there-)
  - [Before the Coding Interview](#before-the-coding-interview)
  - [Running the API](#running-the-api)
- [The API](#the-api)
  - [GET `/fields` &rarr; `{ fields: BasicField[] }`](#get-fields---fields-basicfield-)
  - [GET `/fields/:id` &rarr; `ExtendedField`](#get-fieldsid--extendedfield)
- [The API is a Bit Terrible...](#the-api-is-a-bit-terrible)
- [Your Task](#your-task)
  - [Please note!](#please-note)
  - [Country Flags](#country-flags)
  - [Field Area](#field-area)
  - [Extra Credit if we have time (and you're just awesome like that 🤗)](#extra-credit-if-we-have-time-and-youre-just-awesome-like-that-)

Hi there! 👋
-----------

Thank you for considering Granular! For a portion of your interview, you'll be **live-coding a small React app in TypeScript** based on the API provided in this repo. It's ok to work on the project beforehand, but be prepared to talk through your solution and potentially add to it in the interview. 

### Before the Coding Interview

Please make sure you have

* Installed [the Zoom client](https://zoom.us/download) *and are able to screen-share*
* Your favorite React + TypeScript programming setup all ready to go

### Running the API

Run with `yarn start` and go to [`http://localhost:8000`](http://localhost:8000).

To enable live-reloading for any reason, run `yarn watch`. To change the host and port,

```bash
HOST="127.0.0.1" PORT=8080 yarn serve
```

The API
-------

Always replies with an `application/json` content-type and has only two endpoints. Please look at `resources/types.ts` for what you'll get back. You will want to use that file in your project.

### GET `/fields` &rarr; `{ fields: BasicField[] }`

Returns some basic information on all the fields in the backend. Here's a sample response:

```javascript
{
  "fields": [
    {
        "id": "318fcafb-a40c-425e-bb91-798f2b3e6c3e",
        "name": "Makeba",
        "type": "corporate"
    },
    {
        "id": "2b103f85-919b-4826-9858-00b0729f2fb9",
        "name": "Olathe Farms",
        "type": "individual"
    },
    // ... more `BasicField`s
  ]
}
```

### GET `/fields/:id` &rarr; `ExtendedField`

For the given field ID, returns its basic information _plus_ extended information:

* Field geometry in valid [GeoJSON](https://geojson.org/)
* The field's [two-letter country code](https://www.iban.com/country-codes), and
* The field's owner

Here's a sample request and response:

    GET /fields/318fcafb-a40c-425e-bb91-798f2b3e6c3e

```javascript
{
  "id": "318fcafb-a40c-425e-bb91-798f2b3e6c3e",
  "countryCode": "IN",
  "name": "Moyanka",
  "owner": "Giuseppe Sydow",
  "type": "collective",
  "geoData": {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-95.42449951171875, 44.32384807250689],
          [-95.152587890625, 44.32384807250689],
          [-95.152587890625, 44.39257961837961],
          [-95.42449951171875, 44.39257961837961],
          [-95.42449951171875, 44.32384807250689]
        ]
      ]
    }
  }
}
```

You'll get the expected `HTTP 404` if the Field ID was not found in the `/fields` collection.

The API is **_intentionally_** imperfect
----------------------------------------

At Granular, our APIs are fast, resilient, and reliable 😎 But _this_ API isn't _any_ of these things. 🤦 For the sake of this exercise, consider it is an external, third-party API and build accordingly.

* For both endpoints, it will reply with a **happy `HTTP 200` around 75% of the time** and sulk with a **sad `HTTP 500` around 25% of the time**.
* You might **wait between 10ms and 3s** for all responses.

Locally, you can add these URL params to all endpoints so _you_ can develop faster:

* Add `?fail` to get nothing but HTTP 500s
* Add `?succeed` to get nothing but HTTP 200s (supercedes `fail` (so let's not waste time being cheeky with `fail&succeed` 😁))
* Add `?fast` to enjoy a super-fast API without the simulated latency

Example: `/fields?fail&fast`

Your Task
---------

Create a React application that uses the API to render the list of fields and their extended information. Your app must factor in the API's latency and unreliability when displaying any information to the user.

Using the two endpoints, you'll need to show

* A list of all the Fields
* The total number of Fields
* The name of each Field
* A little icon for each Field's `type`
    - 🏦 when the `type` is "corporate"
    - 👥 when the `type` is "collective"
    - 👤 when the `type` is "individual"
* A small flag based on a Field's `countryCode`
* The Field's area in acres based on its `geoData`

We use (a highly customized extension of) [Reactstrap](https://reactstrap.github.io/) for our products so we'd prefer if you used that in your solution.

### Please note!

👉 If you're comfortable with a UI **library other than Reactstrap**, **please use it instead**.

👉 **Don't worry about how your solution looks** (we have a fantastic Design team for that.) Just focus on the _states_ of the app and the _information_ you're showing the user. 

👉 Please be prepared for questions about **how you'd test your app**. 

👉 Please be prepared for broad discussions about **state management and performance.**

### Country Flags

Use [this library](https://www.npmjs.com/package/react-world-flags) to render a small flag for the `countryCode`.

```javascript
import Flag from "react-world-flags";

<Flag code="US" />
```

### Field Area

Use [this library](https://www.npmjs.com/package/@mapbox/geojson-area) to compute the field's area from its `geoData` attribute:

```typescript
import GeoJSONArea from "@mapbox/geojson-area";

// If `fieldObject` is the upstream response,
const areaInSquaredMeters = GeoJSONArea.geometry(fieldObject.geoData.geometry);
```

The library will return squared meters. Convert that to acres with two decimal places of precision (1 m<sup>2</sup> = 0.000247105 acres). The result must look like this: "3.43 ac".

### Extra Credit if we have time (and you're just awesome like that 🤗)

* Add a toggler that allows the user to switch between acres and hectares (1 m<sup>2</sup> = 0.0001 hectares)
* Add a dropdown to filter by Field `type`
* Sort Fields by their area (ascending and descending)
* Group fields by Country Code
