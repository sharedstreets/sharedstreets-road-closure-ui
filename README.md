# SharedStreets Constructions, Incidents, and Closures Ingestion UI
This is a lightweight web app for cities to generate road construction, incidents, and closures data, utilizing the [SharedStreets Referencing System](https://github.com/sharedstreets/sharedstreets-ref-system) to provide a shared, non-proprietary way of describing this information for use in consumer applications.


## Table of Contents
- Running the application 
- Using the application
- Output formats
- Building on top of the SharedStreets API
- UI Technical Details
- Upcoming development
- Future development

## Running the application

To run the application yourself on your local computer, you will first need to make sure you have node js and npm installed ([see here for instructions](https://www.npmjs.com/get-npm)), as well as yarn ([see here for instructions](https://yarnpkg.com/lang/en/docs/install/)).

Then, you have to [clone this repository](https://help.github.com/articles/cloning-a-repository/):
```
git clone https://github.com/sharedstreets/sharedstreets-road-closure-ui.git
```
Then, install the required dependencies:
```
cd sharedstreets-road-closure-ui/
yarn install 
```
And then finally, you can run the application:
```
yarn start
```
By default, the application will run at the following URL: http://localhost:3000.

## Using the application

![Animated walkthrough of selecting streets on the map](docs/img/RoadClosure-Readme-Walkthru-1)
![Animated walkthrough of filling out the form to describe the closure incident](docs/img/RoadClosure-Readme-Walkthru-2)
![Animated walkthrough of viewing final output](docs/img/RoadClosure-Readme-Walkthru-3)

## Building on top of the SharedStreets API

This web application relies on the [SharedStreets API](https://github.com/sharedstreets/sharedstreets-api), specifically a [geometry matching endpoint](https://github.com/sharedstreets/sharedstreets-api/blob/master/match/geoms.md).  This endpoint takes in GeoJSON LineStrings or FeatureCollections, as well as other SharedStreets-specific parameters, and returns SharedStreets line references that match the input, as well as invalid and unmatched references.


## UI Technical Details

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

This project also makes heavy use of [Redux](https://redux.js.org), a state container for web applications.

## Upcoming development

- Selecting streets by name
- Bulk data input
- Finer-grained data viewing

## Future development
- Pluggable output formats
- Multimodal (bike, pedestrian, parking) support 
