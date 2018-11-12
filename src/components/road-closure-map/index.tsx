import { lineString } from '@turf/helpers';
import { isNil, omitBy } from 'lodash';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import { IRoadClosureState } from 'src/store/road-closure';
// import BaseControl from './base-map-control';
import './road-closure-map.css';

(mapboxgl as any).accessToken = "pk.eyJ1IjoidHJhbnNwb3J0cGFydG5lcnNoaXAiLCJhIjoiY2ptOTN5N3Q3MHN5aDNxbGs2MzhsN3dneiJ9.K4j9mXsvfGCYtM8YouwCKg";

export interface IRoadClosureMapProps {
  findMatchedStreet: () => void,
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
      container: 'SHST-RoadClosureMap-Container',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom
    });

    this.mapContainer.on('move', this.handleMapMove);
    this.mapContainer.on('click', this.handleMapClick);
    // this.mapContainer.addControl(
    //   new BaseControl("base-control")
    // );
  }

  public componentDidUpdate(prevProps: IRoadClosureMapProps) {
    const currentIndex = this.props.roadClosure.currentIndex;
    const items = this.props.roadClosure.items;

    if (!this.props.roadClosure.isFetchingMatchedStreets && prevProps.roadClosure.isFetchingMatchedStreets) {
      this.drawLineFromGeojson("shst-match-geom-line", items[currentIndex].matchedStreets[0], "blue", null, 0.35, 6)
    }
    
  }

  public handleViewportChange = (viewport: any) => {
    this.setState({viewport});
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

  public handleMapClick = (event: any) => {
    const {
      roadClosure: {
        currentIndex,
        items,
      }
    } = this.props;
    const el = document.createElement('div');
    el.className = 'SHST-Map-Point-Marker';
    new mapboxgl.Marker(el)
      .setLngLat(event.lngLat)
      .addTo(this.mapContainer);
    
    if (items[currentIndex].selectedPoints && items[currentIndex].selectedPoints.length+1 > 1) {
      const coords: any = [];
      items[currentIndex].selectedPoints.forEach((v: any) => {
        coords.push([v.lng, v.lat])
      });
      coords.push([event.lngLat.lng, event.lngLat.lat]);
      const linestring = lineString(coords);

      this.drawLineFromGeojson("shst-user-line", linestring, "orange", [2,1], 0.35, 6);
    }
    this.props.pointSelected(event.lngLat);
    if (items[currentIndex].selectedPoints && items[currentIndex].selectedPoints.length > 1) {
      this.props.findMatchedStreet();
    }
  }

  public drawLineFromGeojson(id: string, geojsonData: object, color: string, dasharray: number[] | null, opacity: number, width: number) {
    let paintObj = {
      "line-color": color,
      "line-dasharray" : dasharray,
      "line-opacity": opacity,
      "line-width": width,
    };
    paintObj = omitBy(paintObj, isNil) as any;

    if (typeof this.mapContainer.getLayer(id) !== 'undefined') {
      this.mapContainer.removeLayer(id);
      this.mapContainer.removeSource(id);
    }
    this.mapContainer.addSource(id, {
      data: geojsonData,
      type: "geojson"
    });
    this.mapContainer.addLayer({
      "id": id,
      "paint": paintObj,
      "source": id,
      "type": "line",
    });
  }

  public render() {
    return (
      <div>
        <div id={'SHST-RoadClosureMap-Container'} style={{
          height: '50vh',
          width: '100%',
        }} />
      </div>
    );
  }
}

export default RoadClosureMap;