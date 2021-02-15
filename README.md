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

Thank you for considering Granular! For a portion of your interview, you'll be **live-coding a small React app in TypeScript** based on the API provided in this repo.

### Before the Coding Interview

Please make sure you have

* Installed [the Zoom client](https://zoom.us/download) *and are able to screen-share*
* Your favorite React + TypeScript programming setup all ready to go

### Running the API

Run with `yarn start` and go to [`http://localhost:8000`](http://localhost:8000).

To enable live-reloading for any reason, run `yarn watch`. To change the default port from 8000 to something else, set the `PORT` environment variable.

The API
-------

Always replies with an `application/json` content-type and has only two endpoints. Please look at `resources/types.ts` for what you'll get back.

### GET `/fields` &rarr; `{ fields: BasicField[] }`

Returns some basic information on all the fields in the backend. Here's a sample response:

```javascript
{
  "fields": [
    {
        "id": "2f7211fd-f196-43be-adcd-f90ccba67dd3",
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

    GET /fields/2f7211fd-f196-43be-adcd-f90ccba67dd3

```javascript
{
  "id": "2f7211fd-f196-43be-adcd-f90ccba67dd3",
  "name": "Makeba",
  "type": "corporate",
  "countryCode": "US",
  "geoData": {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [-113.09326171875, 46.22545288226939],
          [-111.5277099609375, 46.22545288226939],
          [-111.5277099609375, 47.234489635299184],
          [-113.09326171875, 47.234489635299184],
          [-113.09326171875, 46.22545288226939],
        ],
      ],
    },
  },
}
```

You'll get the usual HTTP 404 if the ID was not found.

The API is a Bit Terrible...
----------------------------

At Granular, our APIs are fast, resilient, and reliable. _This_ API isn't _any_ of these things 🙄

* For both endpoints, it will reply with a happy `HTTP 200` around 75% of the time and sulk with an `HTTP 500` otherwise.
* You can expect to wait anywhere between 10ms and 3s for all responses.

That being said, you can add these URL params to both endpoints so you can develop faster:

* Add `?fail` to get nothing but HTTP 500s
* Add `?succeed` to get nothing but HTTP 200s (supercedes `fail`)
* Add `?fast` to enjoy a super-fast API without the simulated latency

E.g.: `/fields?fail&fast` (Please note: `succeed` is prioritized, so let's not waste time being cheeky with `fail&succeed` 😁)

Your Task
---------

Create a React application that uses the API to render the list of fields and their extended information. Your app must factor in the API's latency and unreliability when displaying any information to the user.

Using the two endpoints, you'll need to show

* A list of all the fields
* The total number of fields
* The `name` of each field
* A little icon for each field's `type`
    - 🏦 when the `type` is "corporate"
    - 👥 when the `type` is "collective"
    - 👤 when the `type` is "individual"
* A small flag based on a field's `countryCode`
* The field's area in acres based on its `geoData`

We use (a highly customized extension of) [Reactstrap](https://reactstrap.github.io/) for our products so we'd prefer if you used that in your solution.

### Please note!

👉 **If you're comfortable with another React UI library, please use it instead**.

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
