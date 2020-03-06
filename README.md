The API
-------

Always replies with an `application/json` content-type and has just two endpoints.

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

You'll get a 404 if the ID was not found.

The API is a Bit Terrible
-------------------------

At Granular, our APIs are fast, resilient, and reliable. _This_ API isn't any of these things 🙄

* For both endpoints, it will reply with a happy HTTP 200 around 75% of the time and sulk with an HTTP 500 otherwise.
* You can expect to wait anywhere between 10ms and 3s for all responses.

Your Tasks
----------

Create a React application that uses the API to render the list of fields and their extended information. Your app must factor in the API's latency and unreliability when displaying any information to the user.

Use [reactstrap](https://reactstrap.github.io/) but don't worry about how your solution looks (we have a great design team for that.) Just focus on the states of the app and the information you're showing the user. Use TypeScript or JavaScript (or Reason!) Be prepared for questions about how you'd test your app.

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
