import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { lineString, point } from '@turf/helpers';
import { Feature } from 'geojson';
import {
  forEach,
  omit
} from 'lodash';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import { SharedStreetsMatchPath } from 'src/models/SharedStreets/SharedStreetsMatchPath';
import { IRoadClosureState } from 'src/store/road-closure';
import { v4 as uuid } from 'uuid';
import BaseControl from '../base-map-control';
import SharedStreetsMapDrawControl from '../sharedstreets-map-draw-control';
import './road-closure-map.css';

// tslint:disable
const MapboxDraw = require('@mapbox/mapbox-gl-draw');
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
// tslint:enable

const mapboxToken = "pk.eyJ1IjoidHJhbnNwb3J0cGFydG5lcnNoaXAiLCJhIjoiY2ptOTN5N3Q3MHN5aDNxbGs2MzhsN3dneiJ9.K4j9mXsvfGCYtM8YouwCKg";
(mapboxgl as any).accessToken = mapboxToken;

export interface IRoadClosureMapProps {
  findMatchedStreet: (payload: any, currentLineId: string) => void,
  lineCreated: (payload: any) => void,
  lineDeleted: (payload: any) => void,
  lineEdited: (payload: any) => void,
  pointRemoved: () => void,
  pointSelected: (payload: any) => void,
  roadClosure: IRoadClosureState
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
  public mapDraw: any;

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

    this.mapContainer = new mapboxgl.Map({
      center: [longitude, latitude],
      container: 'SHST-Road-Closure-Map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom
    });

    this.mapDraw = new MapboxDraw({
      controls: {
        // line_string: true,
      },
      displayControlsDefault: false,
    });

    this.mapContainer.on('move', this.handleMapMove);
    this.mapContainer.on('mousemove', () => {
      // set pointer style to crosshair when isDrawing is toggled
      this.mapContainer.getCanvas().style.cursor = this.state.isDrawing ? 'crosshair' : '';
    })
    this.mapContainer.on('click', this.handleMapClick);
    this.mapContainer.addControl(
      new mapboxgl.NavigationControl()
    );
    this.mapContainer.addControl(
      new MapboxGeocoder({
        accessToken: mapboxToken
      }),
      'top-left'
    );
    this.mapContainer.addControl(
      this.mapDraw,
      'top-left'
    );
    this.mapContainer.addControl(
      new BaseControl('SHST-Road-Closure-Map-Line-Draw-Control',
        SharedStreetsMapDrawControl,
        {
          onCancel: this.handleCancelDrawing,
          onConfirm: this.handleConfirmDrawing,
          onStart: this.handleStartDrawing,
          onUndo: this.handleUndoLastDrawnPoint,
        }
      ),
      'top-left'
    )
  }

  public componentDidUpdate(prevProps: IRoadClosureMapProps) {
    const {
      currentItem,
      currentLineId,
      isFetchingMatchedStreets
    } = this.props.roadClosure;

    const drawnFeatures = this.mapDraw.getAll();

    forEach(drawnFeatures.features, (feature: Feature) => {
      if (feature.id === this.state.createdLineId) {
        if (!isFetchingMatchedStreets && prevProps.roadClosure.isFetchingMatchedStreets) {
          this.mapDraw.delete(feature.id);
        } else {
          return;
        }
      } else {
        this.mapDraw.delete(feature.id)
      }
    });

    forEach(currentItem.matchedStreets.features, (matchedStreetFeature, index) => {
      // only render SharedStreetsMatchPaths for now, remove to enable intersections
      if (matchedStreetFeature instanceof SharedStreetsMatchPath) {
        this.mapDraw.add(matchedStreetFeature);
      }
    });

    if (prevProps.roadClosure.currentLineId !== currentLineId) {
      this.removeAllSelectedPoints(currentLineId);
      this.removeSelectedLine(currentLineId);
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


    if (newSelectedCoordinates[this.state.currentLineId].length > 1) {
      const selectedLine = lineString(newSelectedCoordinates[this.state.currentLineId]);
      this.mapContainer.getSource(this.state.currentLineId).setData(selectedLine);
    } else {
      this.removeSelectedLine(this.state.currentLineId);
    }
    
    this.setState({
      selectedCoordinates: newSelectedCoordinates,
    });
  }

  public handleMapClick = (event: any) => {
    if (this.state.isDrawing) {
      const newSelectedCoordinates = Object.assign({}, this.state.selectedCoordinates);
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
      </div>
    );
  }
}

export default RoadClosureMap;