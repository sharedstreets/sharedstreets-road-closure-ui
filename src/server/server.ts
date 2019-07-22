import bboxPolygon from '@turf/bbox-polygon';
import envelope from '@turf/envelope';
import * as turfHelpers from '@turf/helpers';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { promises as fsPromises } from 'fs';
import * as  klaw from 'klaw';
// import * as util from 'util';
import { omit } from 'lodash';
import * as nodePath from 'path';
import * as through2 from 'through2';
// import { SharedStreetsReference } from 'sharedstreets-types';

// tslint:disable
// config is relative to bin/
const config = require('../src/config.json');
const sharedstreets = require('sharedstreets');
// tslint:enable

enum MatchDirection {
  BEST,
  BOTH,
}

let matcher: any;

async function getMatcher() {
  // TODO - move TilePathParams into here 
  // const params = new TilePathParams();
  const params: any = {};
  // params.source = flags['tile-source'];
  params.source = "osm/planet-181224";
  // params.tileHierarchy = flags['tile-hierarchy']
  params.tileHierarchy = 6;
  const extent = envelope(bboxPolygon(config.extent));
  const graphs = new sharedstreets.Graph(extent, params, 'car_all');
  await graphs.buildGraph();
  // console.log("graph built");  
  graphs.searchRadius = 25;
  graphs.snapIntersections = true;
  return graphs;
}

// TODO - move PathCandidate into here
// const getMatchedSegments = (path:PathCandidate, ref:SharedStreetsReference) => {
  const getMatchedSegments = (
    path:any,
    // TODO - figure out if ref needs to be in here
    // ref:SharedStreetsReference
  ) => {
  const segmentGeoms: any[] = [];
  for(const segment of path.segments) {
    const segmentGeom = segment.geometry;
    segmentGeom.properties = omit(segment, 'geometry');
  //   segmentGeom.properties.direction = path.endPoint.direction;
    segmentGeoms.push(segmentGeom);
  }

  return segmentGeoms;

};

const app = express();
app.use(bodyParser.text());
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Cache-Control, Content-Type, Accept");
    next();
});

app.put("/save-file", async (req, res) => {
  // tslint:disable-next-line
  console.log(`/save-file/`);
  // tslint:disable-next-line
  console.log(req.query.orgName, req.query.filename, req.query.extension);
  // const body = JSON.parse(req.body)
  // tslint:disable-next-line
  console.log(req.body);
  if (!req.query.orgName || !req.query.filename || !req.query.extension || !req.body) {
    return res.status(404);
  }

  if (!config.directory) {
    return res.status(404);
  }
  const orgDirPath = nodePath.join(config.directory, req.query.orgName);
  try {
    // tslint:disable-next-line
    console.log(`stat orgDirPath: ${orgDirPath}`);
    await fsPromises.stat(orgDirPath)
  } catch (e) {
    try {
      // tslint:disable-next-line
      console.log(`creating orgDirPath: ${orgDirPath}`);
      await fsPromises.mkdir(orgDirPath);
      // tslint:disable-next-line
      console.log(`created orgDirPath`);
    } catch (e) {
      res.status(500).send();
    }
  }
  const fileDirPath = nodePath.join(orgDirPath, req.query.filename);
  try {
    // tslint:disable-next-line
    console.log(`stat fileDirPath: ${fileDirPath}`);
    await fsPromises.stat(fileDirPath)
  } catch (e) {
    try {
      // tslint:disable-next-line
      console.log(`creating fileDirPath: ${fileDirPath}`);
      await fsPromises.mkdir(fileDirPath);
      // tslint:disable-next-line
      console.log(`created fileDirPath`);
    }
    catch (e) {
      res.status(500).send();
    }
  }
  const filePath = nodePath.join(fileDirPath, `${req.query.filename}.${req.query.extension}`);
  try {
    // tslint:disable-next-line
    console.log(`writing to filePath: ${filePath}`);
    const fileContents = JSON.stringify(req.body);
    await fsPromises.writeFile(filePath, fileContents);
    // tslint:disable-next-line
    console.log(`wrote contents: ${fileContents}`);
  } catch (e) {
    res.status(500).send();
  }
  // tslint:disable-next-line
  console.log("200 OK");
  return res.status(200).send();
    // return res.status(500).send();
});

app.get("/load-files/:orgName", async (req, res) => {
  // tslint:disable-next-line
  console.log(`/load-files/${req.params.orgName}`);
  // read
  // const fullPath = nodePath.join(config.directory, req.params.orgName);
  const filterForGeoJSON = through2.obj(function (item, enc, next) {
    // tslint:disable-next-line
    const basename = nodePath.basename(item.path);
    if (basename.includes('geojson')) {
      this.push(item);
    }
    next();
  });

  const items: any[] = [];
  klaw(config.directory)
    .pipe(filterForGeoJSON)
    .on('data', item => items.push(item))
    .on('end', () => {
      // tslint:disable-next-line
      // console.dir(items);
      // sort by last modified
      items.sort((a, b) => a.stats.mtime < b.stats.mtime ? -1 : 1 );
      const output = items.map((item) => {
        return {
          createdTime: item.stats.birthtime,
          id: nodePath.basename(item.path, ".geojson"),
          lastModifiedTime: item.stats.mtime,
        }
      })
      res.status(200).send(JSON.stringify(output));
    })
});

app.get("/load-file/:orgName/:id/:extension", async (req, res) => {
  // tslint:disable-next-line
  console.log(`/load-file/${req.params.orgName}/${req.params.id}/${req.params.extension}`);
  
  // if config set to aws, use that, if not use local
  // parse filename
  // lookup filename in config.directory
  // const directory = config.directory;
  if (!req.params.id || !req.params.orgName) {
    return res.status(404);
  }

  if (!config.directory) {
    return res.status(404);
  }
  const fullPath = nodePath.join(config.directory, req.params.orgName, req.params.id, `${req.params.id}.${req.params.extension}`);
  // const fullPath = nodePath.join(__dirname, '..', 'road-closures', req.query.orgName, req.query.id, `${req.query.id}.geojson`);
  // tslint:disable-next-line
  console.log(fullPath);
  // read
  try {
    const file = await fsPromises.readFile(fullPath, { encoding: 'utf8'});
    if (file) {
      return res.status(200).send(file);
    }
  } catch (error) {
    return res.status(404).end(error.toString());
  }
});
    
app.get("/match/point/:lon,:lat", async (req, res) => {
    const searchPoint = turfHelpers.point([req.params.lon, req.params.lat]);
    const maxCandidates = req.query.maxCandidates;
    const matches = await matcher.matchPoint(searchPoint, null, maxCandidates);
    if (matches.length > 0) {
        const matchFeatures = matches.map((m: any) => m.toFeature());
        const matchedFeatureCollection:turfHelpers.FeatureCollection<turfHelpers.Point> = turfHelpers.featureCollection(matchFeatures);
        res.status(200).send(JSON.stringify(matchedFeatureCollection));
    } else {
        res.status(200).send(turfHelpers.featureCollection([]))
    }
});

app.post("/match/geoms", async (req, res) => {
    // tslint:disable-next-line
    // console.log("POST match/geoms,\nrequest:")
    // tslint:disable-next-line
    // console.log(req.query);
    // tslint:disable-next-line
    // console.log(req.body);
    const query = req.query;
    const body = JSON.parse(req.body);
    // console.log(query);
    // console.log(body);
    // console.log(h);
    // matchLines({}, body, query);
    let matchDirection = MatchDirection.BEST;
    if (query.ignoreDirection) {
        matchDirection = MatchDirection.BOTH;
    }
    // let matchedLines:Array<turfHelpers.Feature<turfHelpers.LineString>> = [];
    // const unmatchedLines:Array<turfHelpers.Feature<turfHelpers.LineString>> = [];
    let matchedLines:any[] = [];
    const unmatchedLines:any[] = [];
    let matchedLine:boolean = false;
    let matchForward = null;
    let matchForwardSegments;
    let matchBackward = null;
    let matchBackwardSegments;

    // TODO - move these into here
    // const forwardGisRef:SharedStreetsReference = forwardReference(body);
    // const backwardGisRef:SharedStreetsReference = backReference(body);

    matchForward = await matcher.matchGeom(body);
    // tslint:disable-next-line
    // console.log("matchForward = \n", matchForward);
    if(matchForward && matchForward.score < matcher.searchRadius * 2) {
        matchForwardSegments = getMatchedSegments(matchForward);
    }
    matchBackward = await matcher.matchGeom(body);
    // console.log("matchBackward = \n", matchBackward);
    if(matchBackward && matchBackward.score < matcher.searchRadius * 2) {
        matchBackwardSegments = getMatchedSegments(matchBackward);
    }

    if (matchDirection === MatchDirection.BEST) {
        if(matchForward && matchBackward) {
            if(matchForward.score > matchBackward.score) {
                matchedLines = matchedLines.concat(matchForwardSegments);
              matchedLine = true;
            }
            else if(matchForward.score === matchBackward.score) {
              if(query.leftSideDriving) {
                // TODO - bring in ReferenceSideOfStreet
                // if(matchForward.sideOfStreet === ReferenceSideOfStreet.LEFT) {
                if(matchForward.sideOfStreet === 'left') {
                  matchedLines = matchedLines.concat(matchForwardSegments);
                }
                else { 
                  matchedLines = matchedLines.concat(matchBackwardSegments);
                }
              }
              else {
                // TODO - bring in ReferenceSideOfStreet
                // if(matchForward.sideOfStreet === ReferenceSideOfStreet.RIGHT) {
                  if(matchForward.sideOfStreet === 'right') {
                  matchedLines = matchedLines.concat(matchForwardSegments);
                }
                else { 
                  matchedLines = matchedLines.concat(matchBackwardSegments);
                }
              }
              matchedLine = true;
            }
            else {
                matchedLines = matchedLines.concat(matchBackwardSegments);
              matchedLine = true;
            }
          }
          else if(matchForward) {
              matchedLines = matchedLines.concat(matchForwardSegments);
            matchedLine = true;
          }
          else if(matchBackward) {
              matchedLines = matchedLines.concat(matchBackwardSegments);
            matchedLine = true;
          }
    } else {
        if(matchForwardSegments) {
            matchedLines = matchedLines.concat(matchForwardSegments);
            matchedLine = true;
        }
    
        if(matchBackwardSegments) {
            matchedLines = matchedLines.concat(matchBackwardSegments);
            matchedLine = true;
        }
    }

    if (!matchedLine) {
        unmatchedLines.push(body);
    }
    
    const output = {
        invalid: {},
        matched: {},
        unmatched: {},
    };

    if(matchedLines && matchedLines.length) {
        const matchedFeatureCollection:turfHelpers.FeatureCollection<turfHelpers.LineString> = turfHelpers.featureCollection(matchedLines);
        output.matched = matchedFeatureCollection;
    }

    if (unmatchedLines && unmatchedLines.length > 0) {
        const unmatchedFeatureCollection:turfHelpers.FeatureCollection<turfHelpers.LineString> = turfHelpers.featureCollection(unmatchedLines);
        output.unmatched = unmatchedFeatureCollection;
    }

    res.status(200).send(JSON.stringify(output));
});

const server = async () => {
  matcher = await getMatcher();
  const appBaseURL = config.server_base_url ? config.server_base_url : 'http://localhost';
  const appPort = config.port ? config.port : 3001;
  app.listen(appPort, () =>  {
      // tslint:disable-next-line
      console.log(`Server running at: ${appBaseURL}:${appPort}`);
  });
};

export default server;