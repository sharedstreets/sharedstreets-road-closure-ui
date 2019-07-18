"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var bbox_polygon_1 = require("@turf/bbox-polygon");
var envelope_1 = require("@turf/envelope");
var turfHelpers = require("@turf/helpers");
var bodyParser = require("body-parser");
var express = require("express");
var lodash_1 = require("lodash");
// import { SharedStreetsReference } from 'sharedstreets-types';
// tslint:disable
var config = require('/Users/indraneel/sharedstreets/sharedstreets-road-closure-ui/config.json');
var sharedstreets = require('sharedstreets');
// tslint:enable
var MatchDirection;
(function (MatchDirection) {
    MatchDirection[MatchDirection["BEST"] = 0] = "BEST";
    MatchDirection[MatchDirection["BOTH"] = 1] = "BOTH";
})(MatchDirection || (MatchDirection = {}));
var matcher;
function getMatcher() {
    return __awaiter(this, void 0, void 0, function () {
        var params, extent, graphs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {};
                    // params.source = flags['tile-source'];
                    params.source = "osm/planet-181224";
                    // params.tileHierarchy = flags['tile-hierarchy']
                    params.tileHierarchy = 6;
                    extent = envelope_1["default"](bbox_polygon_1["default"](config.extent));
                    graphs = new sharedstreets.Graph(extent, params, 'car_all');
                    return [4 /*yield*/, graphs.buildGraph()];
                case 1:
                    _a.sent();
                    // console.log("graph built");  
                    graphs.searchRadius = 25;
                    graphs.snapIntersections = true;
                    return [2 /*return*/, graphs];
            }
        });
    });
}
// TODO - move PathCandidate into here
// const getMatchedSegments = (path:PathCandidate, ref:SharedStreetsReference) => {
var getMatchedSegments = function (path) {
    var segmentGeoms = [];
    for (var _i = 0, _a = path.segments; _i < _a.length; _i++) {
        var segment = _a[_i];
        var segmentGeom = segment.geometry;
        segmentGeom.properties = lodash_1.omit(segment, 'geometry');
        //   segmentGeom.properties.direction = path.endPoint.direction;
        segmentGeoms.push(segmentGeom);
    }
    return segmentGeoms;
};
var app = express();
app.use(bodyParser.text());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/match/point/:lon,:lat", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var searchPoint, maxCandidates, matches, matchFeatures, matchedFeatureCollection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchPoint = turfHelpers.point([req.params.lon, req.params.lat]);
                maxCandidates = req.query.maxCandidates;
                return [4 /*yield*/, matcher.matchPoint(searchPoint, null, maxCandidates)];
            case 1:
                matches = _a.sent();
                if (matches.length > 0) {
                    matchFeatures = matches.map(function (m) { return m.toFeature(); });
                    matchedFeatureCollection = turfHelpers.featureCollection(matchFeatures);
                    res.end(JSON.stringify(matchedFeatureCollection));
                }
                else {
                    res.end(turfHelpers.featureCollection([]));
                }
                return [2 /*return*/];
        }
    });
}); });
app.post("/match/geoms", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var query, body, matchDirection, matchedLines, unmatchedLines, matchedLine, matchForward, matchForwardSegments, matchBackward, matchBackwardSegments, output, matchedFeatureCollection, unmatchedFeatureCollection;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.query;
                body = JSON.parse(req.body);
                matchDirection = MatchDirection.BEST;
                if (query.ignoreDirection) {
                    matchDirection = MatchDirection.BOTH;
                }
                matchedLines = [];
                unmatchedLines = [];
                matchedLine = false;
                matchForward = null;
                matchBackward = null;
                return [4 /*yield*/, matcher.matchGeom(body)];
            case 1:
                // TODO - move these into here
                // const forwardGisRef:SharedStreetsReference = forwardReference(body);
                // const backwardGisRef:SharedStreetsReference = backReference(body);
                matchForward = _a.sent();
                // tslint:disable-next-line
                console.log("matchForward = \n", matchForward);
                if (matchForward && matchForward.score < matcher.searchRadius * 2) {
                    matchForwardSegments = getMatchedSegments(matchForward);
                }
                return [4 /*yield*/, matcher.matchGeom(body)];
            case 2:
                matchBackward = _a.sent();
                // console.log("matchBackward = \n", matchBackward);
                if (matchBackward && matchBackward.score < matcher.searchRadius * 2) {
                    matchBackwardSegments = getMatchedSegments(matchBackward);
                }
                if (matchDirection === MatchDirection.BEST) {
                    if (matchForward && matchBackward) {
                        if (matchForward.score > matchBackward.score) {
                            matchedLines = matchedLines.concat(matchForwardSegments);
                            matchedLine = true;
                        }
                        else if (matchForward.score === matchBackward.score) {
                            if (query.leftSideDriving) {
                                // TODO - bring in ReferenceSideOfStreet
                                // if(matchForward.sideOfStreet === ReferenceSideOfStreet.LEFT) {
                                if (matchForward.sideOfStreet === 'left') {
                                    matchedLines = matchedLines.concat(matchForwardSegments);
                                }
                                else {
                                    matchedLines = matchedLines.concat(matchBackwardSegments);
                                }
                            }
                            else {
                                // TODO - bring in ReferenceSideOfStreet
                                // if(matchForward.sideOfStreet === ReferenceSideOfStreet.RIGHT) {
                                if (matchForward.sideOfStreet === 'right') {
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
                    else if (matchForward) {
                        matchedLines = matchedLines.concat(matchForwardSegments);
                        matchedLine = true;
                    }
                    else if (matchBackward) {
                        matchedLines = matchedLines.concat(matchBackwardSegments);
                        matchedLine = true;
                    }
                }
                else {
                    if (matchForwardSegments) {
                        matchedLines = matchedLines.concat(matchForwardSegments);
                        matchedLine = true;
                    }
                    if (matchBackwardSegments) {
                        matchedLines = matchedLines.concat(matchBackwardSegments);
                        matchedLine = true;
                    }
                }
                if (!matchedLine) {
                    unmatchedLines.push(body);
                }
                output = {
                    invalid: {},
                    matched: {},
                    unmatched: {}
                };
                if (matchedLines && matchedLines.length) {
                    matchedFeatureCollection = turfHelpers.featureCollection(matchedLines);
                    output.matched = matchedFeatureCollection;
                }
                if (unmatchedLines && unmatchedLines.length > 0) {
                    unmatchedFeatureCollection = turfHelpers.featureCollection(unmatchedLines);
                    output.unmatched = unmatchedFeatureCollection;
                }
                res.end(JSON.stringify(output));
                return [2 /*return*/];
        }
    });
}); });
var server = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getMatcher()];
            case 1:
                matcher = _a.sent();
                app.listen(3001, function () {
                    // tslint:disable-next-line
                    console.log('Server running at: http://localhost:3001/');
                });
                return [2 /*return*/];
        }
    });
}); };
exports["default"] = server;
