## Road Closure Data Output Formats


### GeoJSON
Here is an abridged version of the current GeoJSON output format that the Road Closure app generates:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [...]
      },
      "properties": {
        "referenceId": <SharedStreets Reference ID>,
        "fromIntersectionId": <SharedStreets Reference ID>,
        "toIntersectionId": <SharedStreets Reference ID>,
        "fromStreetnames": [<String>, ...],,
        "toStreetnames": [<String>, ...],
        "roadClass": "Primary",
        "geometryId": <Unique ID>,
        "streetname": <String>,
...
      }
    }
  ],
  "properties": {
    "type": "ROAD_CLOSED",
    "timezone": "America/New_York",
    "startTime": "Sun Jun 02 2019 00:00:00",
    "endTime": "Sat Jun 08 2019 00:00:00",
    "description": "Planned Construction",
    "reference": "DOT",
    "subtype": "ROAD_CLOSED_CONSTRUCTION"
  }
}
```

### CIFS (Waze)

```
{
  "incidents": [{
      "id": "3f4r45ff233",
      "referenceId": <SharedStreets Reference ID>,
      "creationtime": "2017-07-04T13:31:17-04:00",
      "updatetime": "2017-11-17T04:40:41-05:00",
      "description": "Complete road closure due to road works",
      "location": {
        "street": "N Liberty St",
        "direction": "BOTH_DIRECTIONS",
        "polyline": "42.1601432984533 -119.3525208937842 42.1781676611244 -119.35679623266"
      },
      "starttime": "2017-06-05T00:01:00-04:00",
      "endtime": "2017-11-22T15:30:00-05:00",
      "type": "ROAD_CLOSED"
    },
    {
      "id": "zxf3kvmrpf",
      "referenceId": <SharedStreets Reference ID>,
      "creationtime": "2017-08-04T13:31:30-04:00",
      "updatetime": "2017-12-17T04:40:41-05:00",
      "description": "St Johns Sdrd from William Graham to Woodbine in the Town of Aurora. Closed until Dec 31. ",
      "type": "ROAD_CLOSED",
      "subtype": "ROAD_CLOSED_CONSTRUCTION",
      "location": {
        "street": "St John's Sideroad",
        "direction": "BOTH_DIRECTIONS",
        "polyline": "44.02712 -99.43131 44.023011 -99.363349 44.02712 -99.43131 44.0343021 - 99.399426"
      },
      "starttime": "2017-04-18T00:01:00-04:00",
      "endtime": "2017-12-31T23:59:00-05:00"
    }
  ]
}
```
