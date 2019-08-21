# SharedStreets Constructions, Incidents, and Closures Ingestion UI
This is a lightweight web app for cities to generate road construction, incidents, and closures data, utilizing the [SharedStreets Referencing System](https://github.com/sharedstreets/sharedstreets-ref-system) to provide a shared, non-proprietary way of describing this information for use in consumer applications.


## Table of Contents
- Running the application 
- Using the application
- Output formats

## Running the application locally/on your own computer

To run the application yourself on your local computer, you will need a Linux or Mac. Then, make sure you have node js and npm installed ([see here for instructions](https://www.npmjs.com/get-npm)), as well as yarn ([see here for instructions](https://yarnpkg.com/lang/en/docs/install/)).

Then, you have to [clone this repository](https://help.github.com/articles/cloning-a-repository/):
```
git clone https://github.com/sharedstreets/sharedstreets-road-closure-ui.git
```
Then, install the required dependencies:
```
cd sharedstreets-road-closure-ui/
yarn install 
```
You'll have to create a file named `.env` in the application's top-most/root directory.
You can simply make a copy of the included file `.env.example` and populate the values appropriately:
```
REACT_APP_base_server_url=<base URL of the included server. if this is empty, default value is http://localhost>
REACT_APP_directory=full path to road closure files directory, ex: /Users/indraneel/road-closures/
REACT_APP_extent=[min X coordinate, min Y coordinate, max X coordinate, max Y coordinate]
REACT_APP_org_name=your organization's name. this will be appended to the 'directory' path, ex: /Users/indraneel/road-closures/organization-name>
REACT_APP_server_port=3001
```
You can use a website like [bboxfinder](http://bboxfinder.com) to find your extent value. Note that the **REACT_APP_extent** specified is the only region within with you'll be able to mark streets as closed. Also make sure **REACT_APP_extent** is four values surrounded by square brackets (like this: [-70, 40, -70, 40]).

Next, you need to build the application by running this command:
```
yarn build:local
```
This will create a build of the web app that relies on the included `server.ts`.
Note that this command (and `start:local`) sets the environment variable `REACT_APP_LOCAL_SERVER` to `true`.

And then finally, you can run the application:
```
yarn server
```
By default, the application will run at the following URL: http://localhost:3001 unless you've configured it otherwise.

## Using the application

![Animated walkthrough of selecting streets on the map](https://i.imgur.com/AzajbbIh.gif)

![Animated walkthrough of filling out the form to describe the closure incident](https://i.imgur.com/KPBMJo1.gif)

![Animated walkthrough of viewing final output](https://i.imgur.com/NxBSTOD.gif)

## Output formats

The SharedStreets Road Closures app [extends GeoJSON](https://github.com/sharedstreets/sharedstreets-road-closure-ui/tree/master/src/models/SharedStreets) for all internal application data. 

Data can be exported for consumption as the GeoJSON and/or the [Closure Information Feed Specification (CIFS)](https://developers.google.com/waze/data-feed/road-closure-information) format.