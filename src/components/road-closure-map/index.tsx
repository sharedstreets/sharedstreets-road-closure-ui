import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import {
  forEach,
} from 'lodash';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import { IRoadClosureState } from 'src/store/road-closure';
import './road-closure-map.css';

// tslint:disable-next-line
const MapboxDraw = require('@mapbox/mapbox-gl-draw');

(mapboxgl as any).accessToken = "pk.eyJ1IjoidHJhbnNwb3J0cGFydG5lcnNoaXAiLCJhIjoiY2ptOTN5N3Q3MHN5aDNxbGs2MzhsN3dneiJ9.K4j9mXsvfGCYtM8YouwCKg";

export interface IRoadClosureMapProps {
  findMatchedStreet: (payload: any) => void,
  lineCreated: (payload: any) => void,
  lineDeleted: (payload: any) => void,
  lineEdited: (payload: any) => void,
  pointRemoved: () => void,
  pointSelected: (payload: any) => void,
  roadClosure: IRoadClosureState
};

export interface IRoadClosureMapState {
  viewport: object
}

class RoadClosureMap extends React.Component<IRoadClosureMapProps, IRoadClosureMapState> {
  public state = {
    selectedPoints: [],
    viewport: {
      latitude: 47.608791594905625,
      longitude: -122.3348826226224,
      zoom: 13
    },
  }

  public mapContainer: any;
  public mapDraw: any;

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
      container: 'SHST-RoadClosure-Map',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom
    });

    this.mapDraw = new MapboxDraw({
      controls: {
        line_string: true,
      },
      displayControlsDefault: false,
    });

    this.mapContainer.on('move', this.handleMapMove);

    this.mapContainer.addControl(
      this.mapDraw,
      'top-left'
    );
    this.mapContainer.on('draw.create', this.handleLineCreated);
    this.mapContainer.on('draw.delete', this.handleLineDeleted);
    this.mapContainer.on('draw.update', this.handleLineEdited);
    this.mapContainer.addControl(
      new mapboxgl.NavigationControl()
    );
  }

  public componentDidUpdate(prevProps: IRoadClosureMapProps) {
    const {
      currentIndex,
      items
    } = this.props.roadClosure;

    this.mapDraw.deleteAll();
    forEach(items[currentIndex].matchedStreets, (matchedStreetList, outerIndex) => {
      forEach(matchedStreetList, (matchedStreet, index) => {
        this.mapDraw.add(matchedStreet);
      })
    });
    
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

  public handleLineCreated = (e: { type: string, target: any, features: GeoJSON.Feature[]}) => {
    Promise.resolve(this.props.findMatchedStreet(e.features[0]))
    .then(() => {
      this.mapDraw.delete(e.features[0].id);
    });
  }

  public handleLineDeleted = (e: { type: string, target: any, features: GeoJSON.Feature[]}) => {
    this.props.lineDeleted(e.features[0]);
  }

  public handleLineEdited = (e: { type: string, target: any, features: GeoJSON.Feature[]}) => {
    this.props.findMatchedStreet(e.features[0]);
  }

  public render() {
    return (
      <div className={'SHST-RoadClosure-Map-Container'}>
        <div id={'SHST-RoadClosure-Map'} style={{
          height: '100%',
          margin: '0 auto',
          width: '100%',
        }} />
      </div>
    );
  }
}

export default RoadClosureMap;