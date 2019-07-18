import bboxPolygon from '@turf/bbox-polygon';
import envelope from '@turf/envelope';
import * as turfHelpers from '@turf/helpers';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { omit } from 'lodash';
// import { SharedStreetsReference } from 'sharedstreets-types';

// tslint:disable
const config = require('/Users/indraneel/sharedstreets/sharedstreets-road-closure-ui/config.json');
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
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

app.get("/match/point/:lon,:lat", async (req, res) => {
    const searchPoint = turfHelpers.point([req.params.lon, req.params.lat]);
    const maxCandidates = req.query.maxCandidates;
    const matches = await matcher.matchPoint(searchPoint, null, maxCandidates);
    if (matches.length > 0) {
        const matchFeatures = matches.map((m: any) => m.toFeature());
        const matchedFeatureCollection:turfHelpers.FeatureCollection<turfHelpers.Point> = turfHelpers.featureCollection(matchFeatures);
        res.end(JSON.stringify(matchedFeatureCollection));
    } else {
        res.end(turfHelpers.featureCollection([]))
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
    console.log("matchForward = \n", matchForward);
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

    res.end(JSON.stringify(output));
});

const server = async () => {
  matcher = await getMatcher();
  app.listen(3001, () =>  {
      // tslint:disable-next-line
      console.log('Server running at: http://localhost:3001/');
  });
};

export default server;