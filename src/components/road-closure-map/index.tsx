import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { 
  featureCollection,
  lineString,
  point
} from '@turf/helpers';
// import { Feature } from 'geojson';
import {
  // forEach,
  // flatten,
  omit
} from 'lodash';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
// import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { SharedStreetsMatchGeomPath } from 'src/models/SharedStreets/SharedStreetsMatchGeomPath';
import { SharedStreetsMatchPointFeatureCollection } from 'src/models/SharedStreets/SharedStreetsMatchPointFeatureCollection';
import { IRoadClosureState } from 'src/store/road-closure';
import { v4 as uuid } from 'uuid';
import { AppExtent } from '../../config';
import SharedStreetsMapDrawControl from '../sharedstreets-map-draw-control';
import './road-closure-map.css';

// tslint:disable
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
const MapboxTimespace = require('@mapbox/timespace');
const center = require('@turf/center').default;
// tslint:enable

const mapboxToken = "pk.eyJ1IjoidHJhbnNwb3J0cGFydG5lcnNoaXAiLCJhIjoiY2ptOTN5N3Q3MHN5aDNxbGs2MzhsN3dneiJ9.K4j9mXsvfGCYtM8YouwCKg";
(mapboxgl as any).accessToken = mapboxToken;

export interface IRoadClosureMapProps {
  findMatchedPoint: (payload: any, currentLineId: string) => void,
  findMatchedStreet: (payload: any, currentLineId: string) => void,
  lineCreated: (payload: any) => void,
  lineDeleted: (payload: any) => void,
  lineEdited: (payload: any) => void,
  pointRemoved: () => void,
  pointSelected: (payload: any) => void,
  inputChanged: (payload: any) => void,
  currentPossibleDirections: SharedStreetsMatchPointFeatureCollection,
  currentRoadClosureItemOutput: any,
  directionIconPoints: any,
  highlightedFeatureGroup: SharedStreetsMatchGeomPath[],
  intersectionPoints: any,
  isDrawingEnabled: boolean,
  roadBlockIconPoints: any,
  roadClosure: IRoadClosureState,
};

interface IRoadClosureMapSelectedCoordinates {
  [lineId: string] : number[][];
}

export interface IRoadClosureMapState {
  createdLineId: any,
  currentLineId: string,
  viewport: any,
  isDrawing: boolean,
  selectedCoordinates: IRoadClosureMapSelectedCoordinates,
  lastPointIndex: number,
}

class RoadClosureMap extends React.Component<IRoadClosureMapProps, IRoadClosureMapState> {
  public mapContainer: any;

  public constructor(props: IRoadClosureMapProps) {
    super(props);

    this.state = {
      createdLineId: 'lineId',
      currentLineId: '',
      isDrawing: false,
      lastPointIndex: 0,
      selectedCoordinates: {},
      viewport: {
        latitude: 38.5,
        longitude: -98,
        zoom: 3
      },
    }
  }

  public componentDidMount() {
    const {
      viewport: {
        latitude,
        longitude,
        zoom,
      }
    } = this.state;

    const mapboxInitConfig: any = {
      center: [longitude, latitude],
      container: 'SHST-Road-Closure-Map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom
    };
    if (AppExtent && AppExtent.length === 4) {
      mapboxInitConfig.bounds = AppExtent;
      mapboxInitConfig.center = center(bboxPolygon(AppExtent)).geometry.coordinates;
      mapboxInitConfig.zoom = 10;
    }
    this.mapContainer = new mapboxgl.Map(mapboxInitConfig);

    this.mapContainer.on('move', this.handleMapMove);
    this.mapContainer.on('mousemove', () => {
      // set pointer style to crosshair when isDrawing is toggled
      this.mapContainer.getCanvas().style.cursor = this.state.isDrawing ? 'crosshair' : '';
    })
    this.mapContainer.on('click', this.handleMapClick);
    this.mapContainer.on('mousemove', this.handleShowPossibleDirections)
    this.mapContainer.addControl(
      new mapboxgl.NavigationControl()
    );
    this.mapContainer.addControl(
      new MapboxGeocoder({
        accessToken: mapboxToken
      }),
      'top-left'
    );

    this.mapContainer.on('load', () => {
      if (AppExtent && AppExtent.length === 4) {
        this.mapContainer.addSource('extentBbox', {
          data: bboxPolygon(AppExtent),
          type: "geojson"
        });
        this.mapContainer.addLayer({
          "id": "extentLayer",
          "source": "extentBbox",
          "type": "line",
        })
      }
      if (!this.mapContainer.getLayer('matchedFeatures')) {
        this.mapContainer.addSource('matchedFeatures', {
          // data: this.props.roadClosure.currentItem,
          data: this.props.currentRoadClosureItemOutput,
          type: "geojson",
        });
        this.mapContainer.addLayer({
          "id": 'matchedFeatures',
          "paint": {
            "line-color": [ 'match', ['get', 'color'],
                            '#E35051', '#E35051', // #E35051 - highlighted
                            "#253EF7"], // default - blue 
            "line-offset": 5,
            "line-opacity": [ 'match', ['get', 'color'],
                            '#E35051', 0.8, // #E35051 - highlighted
                            0.5], // default - blue 
            "line-width": 3,
          },
          "source": 'matchedFeatures',
          "type": "line",
        });

        this.mapContainer.addSource('possibleDirectionsPoints', {
          data: this.props.currentPossibleDirections,
          type: "geojson",
        });
        this.mapContainer.addLayer({
          "id": "possibleDirections",
          'layout': {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-image': 'triangle-11',
            'icon-offset': [0, -7],
            'icon-rotate': {
              'property': 'bearing',
              'type': 'identity',
            },
            'icon-rotation-alignment': 'map',
            'icon-size': 1.5,
          },
          // "paint": {
          //   "icon-color": "red",
          // },
          "source": "possibleDirectionsPoints",
          "type": "symbol",
        });

        this.mapContainer.addSource('directionPoints', {
          data: this.props.roadClosure.currentItem,
          type: "geojson",
        });
        this.mapContainer.addLayer({
          "id": "direction",
          'layout': {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-image': 'triangle-11',
            'icon-offset': [5, 0],
            'icon-rotate': {
              'property': 'bearing',
              'type': 'identity',
            },
            'icon-rotation-alignment': 'map',
            'icon-size': 1.5,
          },
          // "paint": {
          //   "icon-color": "red",
          // },
          "source": "directionPoints",
          "type": "symbol",
        });

        this.mapContainer.addSource('intersectionPoints', {
          data: this.props.intersectionPoints,
          type: "geojson",
        });
        this.mapContainer.addLayer({
          "id": "intersections",
          'layout': {
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-image': [
              "case",
              ["==", ["get", "closed"], true],
              ["literal", "circle-11"],
              ["literal", "circle-stroked-11"],
            ],
            'icon-rotation-alignment': 'map',
            'icon-size': 1.5,
          },
          // "paint": {
          //   "icon-color": "red",
          // },
          "source": "intersectionPoints",
          "type": "symbol",
        });

        // this.mapContainer.loadImage('/roadblock.png', (error: any, image: any) => {
        //   if (error) {
        //     throw error;
        //   }
            
        //   this.mapContainer.addImage("roadblock", image, {
        //     "sdf": true
        //   });

        //   this.mapContainer.addSource('roadblockPoints', {
        //     data: this.props.roadClosure.currentItem,
        //     type: "geojson",
        //   });
        //   this.mapContainer.addLayer({
        //     "id": "roadblock",
        //     "layout": {
        //       "icon-allow-overlap": true,
        //       "icon-image": "roadblock",
        //       "icon-size": 0.2

        //     },
        //     "paint": {
        //       "icon-color": "red",
        //     },
        //     "source": "roadblockPoints",
        //     "type": "symbol",
        //   });

        // })
      }
    })
  }

  public componentDidUpdate(prevProps: IRoadClosureMapProps) {
    const {
      // currentItem,
      currentLineId,
    } = this.props.roadClosure;

    if (this.mapContainer.getLayer('matchedFeatures')) {
      this.mapContainer.getSource('matchedFeatures').setData(this.props.currentRoadClosureItemOutput);
    }

    // if (this.mapContainer.getLayer('roadblock')) {
    //   this.mapContainer.getSource('roadblockPoints').setData(this.props.roadBlockIconPoints);
    // }
    
    if (this.mapContainer.getLayer('direction')) {
      this.mapContainer.getSource('directionPoints').setData(this.props.directionIconPoints);
    }
        
    if (this.mapContainer.getLayer('possibleDirections')) {
      this.mapContainer.getSource('possibleDirectionsPoints').setData(this.props.currentPossibleDirections);
    }

    if (this.mapContainer.getLayer('intersections')) {
      this.mapContainer.getSource('intersectionPoints').setData(this.props.intersectionPoints);
    }

    if (prevProps.roadClosure.currentLineId !== currentLineId) {
      this.removeAllSelectedPoints(currentLineId);
      this.removeSelectedLine(currentLineId);
    }

    if (prevProps.highlightedFeatureGroup !== this.props.highlightedFeatureGroup) {
      this.mapContainer.fitBounds(
        bbox(
          featureCollection(this.props.highlightedFeatureGroup)
        ),
        {
          padding: {top: 100, bottom:100, left: 100, right: 100}
        }
      )
    }

    if (!prevProps.roadClosure.isLoadedInput && this.props.roadClosure.isLoadedInput) {
      this.mapContainer.fitBounds(
        bbox(
          this.props.currentRoadClosureItemOutput
        ),
        {
          padding: {top: 100, bottom:100, left: 100, right: 100}
        }
      )
    }
  }

  public removeAllSelectedPoints = (lineId: string) => {
    let pointIndex = 0;
    let lastPointId = `point-${lineId}-${pointIndex}`;
    while (this.mapContainer.getLayer(lastPointId)) {
      if (this.mapContainer.getLayer(lastPointId)) {
        this.mapContainer.removeLayer(lastPointId);
        this.mapContainer.removeSource(lastPointId);
      }
      pointIndex++;
      lastPointId = `point-${lineId}-${pointIndex}`;
    }
  }

  public removeSelectedLine = (lineId: string) => {
    if (this.mapContainer.getLayer(lineId)) {
      this.mapContainer.removeLayer(lineId);
      this.mapContainer.removeSource(lineId);
    }
  }

  public handleStartDrawing = (event: any) => {
    const lineUuid = uuid();
    const newSelectedCoordinates = Object.assign({}, this.state.selectedCoordinates);
    newSelectedCoordinates[lineUuid] = [];
    this.setState({
      currentLineId: lineUuid,
      isDrawing: true,
      selectedCoordinates: newSelectedCoordinates
    });
  }
  
  public handleConfirmDrawing = (event: any) => {
    if (this.state.selectedCoordinates[this.state.currentLineId].length > 1) {
      const selectedLine = lineString(this.state.selectedCoordinates[this.state.currentLineId]);
      this.props.findMatchedStreet(selectedLine, this.state.currentLineId)
      this.setState({
        currentLineId: '',
        isDrawing: false,
      });
    }

  }
  public handleCancelDrawing = (event: any) => {
    this.removeAllSelectedPoints(this.state.currentLineId);
    this.removeSelectedLine(this.state.currentLineId);

    const newSelectedCoordinates = omit(this.state.selectedCoordinates, this.state.currentLineId);
    this.props.findMatchedPoint(
      point([]),
      this.state.currentLineId,
    );
    this.setState({
      currentLineId: '',
      isDrawing: false,
      selectedCoordinates: newSelectedCoordinates,
    });
  }
  public handleUndoLastDrawnPoint = (event: any) => {
    if (this.state.selectedCoordinates[this.state.currentLineId].length === 0) {
      return;
    }

    const newSelectedCoordinates = Object.assign({}, this.state.selectedCoordinates);
    const lastPointId = `point-${this.state.currentLineId}-${newSelectedCoordinates[this.state.currentLineId].length-1}`;
    if (this.mapContainer.getLayer(lastPointId)) {
      this.mapContainer.removeLayer(lastPointId);
      this.mapContainer.removeSource(lastPointId);
    }
    newSelectedCoordinates[this.state.currentLineId].pop();
    const lastSelectedPoint = newSelectedCoordinates[this.state.currentLineId][
      newSelectedCoordinates[this.state.currentLineId].length-1
    ];
    this.props.findMatchedPoint(
      point(lastSelectedPoint),
      this.state.currentLineId,
    );

    if (newSelectedCoordinates[this.state.currentLineId].length > 1) {
      const selectedLine = lineString(newSelectedCoordinates[this.state.currentLineId]);
      this.mapContainer.getSource(this.state.currentLineId).setData(selectedLine);
    } else if (newSelectedCoordinates[this.state.currentLineId].length === 1) {
      this.removeSelectedLine(this.state.currentLineId);
    }
    
    this.setState({
      selectedCoordinates: newSelectedCoordinates,
    });
  }

  public handleShowPossibleDirections = (event: any) => {
    if (this.state.isDrawing) {
      this.props.findMatchedPoint(
        point([event.lngLat.lng, event.lngLat.lat]),
        this.state.currentLineId,
      );
    }
  }

  public handleMapClick = (event: any) => {
    if (this.state.isDrawing) {


      const newSelectedCoordinates = Object.assign({}, this.state.selectedCoordinates);
      if (newSelectedCoordinates[this.state.currentLineId].length === 0) {
        const timeFromPointClicked = MapboxTimespace.getFuzzyLocalTimeFromPoint(new Date(), [event.lngLat.lng, event.lngLat.lat])
        if (timeFromPointClicked._z.name) {
          this.props.inputChanged({
            key: 'timezone',
            timezone: timeFromPointClicked._z.name
          });
        }
      }

      newSelectedCoordinates[this.state.currentLineId].push([event.lngLat.lng, event.lngLat.lat]);
      const newPoint = point([event.lngLat.lng, event.lngLat.lat]);
      const pointId = `point-${this.state.currentLineId}-${newSelectedCoordinates[this.state.currentLineId].length-1}`;
      this.mapContainer.addSource(pointId, {
        data: newPoint,
        type: "geojson",
      });
      this.mapContainer.addLayer({
        "id": pointId,
        "paint": {
          "circle-color": "red",
          "circle-opacity": 0.5
        },
        "source": pointId,
        "type": "circle",
      });

      if (newSelectedCoordinates[this.state.currentLineId].length > 1) {
        const selectedLine = lineString(this.state.selectedCoordinates[this.state.currentLineId]);

        this.removeSelectedLine(this.state.currentLineId);
        this.mapContainer.addSource(this.state.currentLineId, {
          data: selectedLine,
          type: "geojson",
        });
        this.mapContainer.addLayer({
          "id": this.state.currentLineId,
          "paint": {
            "line-color": "orange",
            "line-dasharray": [5, 1],
            "line-opacity": 0.75,
            "line-width": 3,
          },
          "source": this.state.currentLineId,
          "type": "line",
        });
      }
      // else if (newSelectedCoordinates[this.state.currentLineId].length > 0) {
      //   this.mapContainer.setLayoutProperty('possibleDirections', 'visibility', 'visible');
      // }

      this.setState({
        selectedCoordinates: newSelectedCoordinates
      });
    }
  }

  public handleMapMove = () => {
    const { lng, lat } = this.mapContainer.getCenter();
    this.setState({
      viewport: {
        latitude: lat.toFixed(4),
        longitude: lng.toFixed(4),
        zoom: this.mapContainer.getZoom().toFixed(2)
      }
    });
  }

  public render() {
    return (
      <div className={'SHST-Road-Closure-Map-Container'}>
        <div id={'SHST-Road-Closure-Map'} style={{
          height: '100%',
          margin: '0 auto',
          width: '100%',
        }} />
        {
          this.props.isDrawingEnabled && 
          <SharedStreetsMapDrawControl
            isFetchingMatchedStreets={this.props.roadClosure.isFetchingMatchedStreets}
            numberOfPointsSelected={
              this.state.selectedCoordinates[this.state.currentLineId] ? 
              this.state.selectedCoordinates[this.state.currentLineId].length
              : 0
            }
            onCancel={this.handleCancelDrawing}
            onConfirm={this.handleConfirmDrawing}
            onStart={this.handleStartDrawing}
            onUndo={this.handleUndoLastDrawnPoint}
          />
        }
      </div>
    );
  }
}

export default RoadClosureMap;