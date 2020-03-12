* [Hi there! <g-emoji class="g-emoji" alias="wave" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f44b.png">👋</g-emoji>](#hi-)
  - [Before the Coding Interview](#before-the-coding-interview)
  - [Running the API](#running-the-api)
* [The API](#the-api)
  - [GET /fields](#get-fields)
  - [GET /fields/:id](#get-fieldsid)
* [The API is a Bit Terrible](#the-api-is-a-bit-terrible)
* [Your Tasks](#your-tasks)
  - [The List of Fields](#the-list-of-fields)
  - [A Single Field](#a-single-field)
  - [Extra Credit](#extra-credit)

Hi there! 👋
-----------

Thank you for considering Granular! For a portion of your interview, you'll be live-coding a small React app based on the API provided in this repo.

### Before the Coding Interview

Please make sure you have

* Installed [the Zoom client](https://zoom.us/download) *and are able to screen-share*
* Your favorite IDE/editor and a terminal with Node v12+ all ready to go
* A fresh [`create-react-app`](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) project set up (with either JavaScript or TypeScript)

### Running the API

Run with `yarn serve`. To enable live-reloading for any reason, run `yarn watch`. Go to [`http://localhost:8000`](http://localhost:8000) (or set an environment variable `PORT` to whatever you'd like.)

The API
-------

Always replies with an `application/json` content-type and has just two endpoints.

### GET `/fields`

Returns a list of all the fields in the system. Provides basic information about a field: its ID, Name, and Type.

* ID is just UUIDv4
* Name is a string and never `null`
* Type is one of "corporation", "collective", or "individual"

```
{
  "fields": [
    {
        "id": "2f7211fd-f196-43be-adcd-f90ccba67dd3",
        "name": "Makeba",
        "type": "corporation"
    },
    {
        "id": "2b103f85-919b-4826-9858-00b0729f2fb9",
        "name": "Olathe Farms",
        "type": "individual"
    },
    .
    .
    .
  ]
}
```

### GET `/fields/:id`

For the given field ID, returns its basic information _plus_ extended information:

* Field geometry in valid [GeoJSON](https://geojson.org/) and,
* the field's [two-letter country code](https://www.iban.com/country-codes), which is always uppercased.

Here's a sample request and response:

    GET /fields/2f7211fd-f196-43be-adcd-f90ccba67dd3

```json
{
  "id": "2f7211fd-f196-43be-adcd-f90ccba67dd3",
  "name": "Makeba",
  "type": "corporation",
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

You'll get an HTTP 404 if the ID was not found.

The API is a Bit Terrible
-------------------------

At Granular, our APIs are fast, resilient, and reliable. _This_ API isn't any of these things 🙄

* For both endpoints, it will reply with a happy HTTP 200 around 75% of the time and sulk with an HTTP 500 otherwise.
* You can expect to wait anywhere between 10ms and 3s for all responses.

That being said, you can add these URL params to both endpoints so you can develop faster:

* Add `?fail` to get nothing but HTTP 500s
* Add `?succeed` to get nothing but HTTP 200s (supercedes `fail`)
* Add `?fast` to enjoy a super-fast API without the simulated latency

E.g. `/fields?fail&fast`

Your Tasks
----------

Create a React application that uses the API to render the list of fields and their extended information. Your app must factor in the API's latency and unreliability when displaying any information to the user.

Use [reactstrap](https://reactstrap.github.io/) but don't worry about how your solution looks (we have a great design team for that.) Just focus on the states of the app and the information you're showing the user. Be prepared for questions about how you'd test your app.

Using the two endpoints, you'll need to show

* The total number of fields
* The `name` of each field
* A little icon for each field's `type`
    - 🏦 when the `type` is "corporate"
    - 👥 when the `type` is "collective"
    - 👤 when the `type` is "individual"
* A small flag based on a field's `countryCode`
* The field's area in acres based on its `geoData`

### Country Flags

Use [this library](https://www.npmjs.com/package/react-world-flags) to render a small flag for the `countryCode`.

```javascript
import Flag from "react-world-flags";

<Flag code="US" />
```

### Field Area

Use [this library](https://www.npmjs.com/package/@mapbox/geojson-area) to compute the field's area from its `geoData` attribute:

```javascript
import GeoJSONArea from "@mapbox/geojson-area";

// If `fieldObject` is the upstream response,
const areaInSquaredMeters = GeoJSONArea.geometry(fieldObject.geoData.geometry);
```

The library will return squared meters. Convert that to acres with two decimal places of precision (1 m<sup>2</sup> = 0.000247105 acres). The result must look like this: "3.43 ac".

### Extra Credit

* Add a toggler that allows the user to switch between acres and hectares (1 m<sup>2</sup> = 0.0001 hectares)
* Add a dropdown to filter by field `type`
* Sort fields by their area (ascending and descending)
* Group fields by country code
