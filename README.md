* [Pre-interview](#pre-interview)
* [The API](#the-api)
    - [GET `/fields`](#get-fields)
    - [GET `/fields/:id`](#get-fieldsid)
* [The API is a Bit Terrible](#the-api-is-a-bit-terrible)
* [Your Tasks](#your-tasks)
    - [The List of Fields](#the-list-of-fields)
    - [A Single Field](#a-single-field)
    - [Extra Credit](#extra-credit)

Pre-interview
-------------

For this part of the interview, you will be live-coding a mini React app based on the API provided in this repo.
Please make sure you have the following ready prior to the interview.

1. Ensure that you are able to screen share via zoom from your computer.
2. Have a code editor and terminal of your choice
3. Have an empty [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) set up and ready to go

The API
-------

Always replies with an `application/json` content-type and has just two endpoints.

Run with `yarn serve`. To enable live-reloading for any reason, run `yarn watch`. Go to [`http://localhost:8000`](http://localhost:8000) (or set an environment variable `PORT` to whatever you'd like.)

### GET `/fields`

Returns a list of all the fields in the system. Provides basic information about a field: its ID, Name, and Type.

* ID is just UUIDv4
* Name is a string and never `null`
* Type is one of "corporation", "collective", or "individual"

```json
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

* Field geometry in [GeoJSON](https://geojson.org/) and,
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

Use [reactstrap](https://reactstrap.github.io/) but don't worry about how your solution looks (we have a great design team for that.) Just focus on the states of the app and the information you're showing the user. Use TypeScript or JavaScript (or Reason!) Be prepared for questions about how you'd test your app.

For each field, please display the following items. More details on each of these items and how to get them can be found in the sections below.
* Name of the field
* The emoji corresponding to the field's type
* The flag for the country the field belongs to
* The area of the field in acres

In addition, please display the total number of fields.

### The List of Fields

When you load the list (via `/fields`), don't display any field's `id`. Just show its `name`. For the field's `type`, don't display the text; show these emojis instead

* 🏦 when the `type` is "corporate"
* 👥 when the `type` is "collective"
* 👤 when the `type` is "individual"

### A Single Field

Call `/fields/:id` to get a field's extended information.

For `countryCode`, don't display the two-letter code. Use [this library](https://www.npmjs.com/package/react-world-flags) to render a small flag.

```javascript
import Flag from "react-world-flags";

<Flag code="US" />
```

Then use [this library](https://www.npmjs.com/package/@mapbox/geojson-area) to compute the field's area from its `geoData` attribute:

```javascript
import GeoJSONArea from "@mapbox/geojson-area";

// If `fieldObject` is the upstream response,
const areaInSquaredMeters = GeoJSONArea.geometry(fieldObject.geoData.geometry);
```

The library will return squared meters. Convert that to acres with two decimal places of precision (1 m<sup>2</sup> = 0.000247105 acres). The result must look like this: "3.43 ac".

### Extra Credit

* Write a toggler that allows the user to switch between acres and hectares (1 m<sup>2</sup> = 0.0001 hectares)
* Add a dropdown to filter by field `type`
* Sort fields by their area
* Group by country code
