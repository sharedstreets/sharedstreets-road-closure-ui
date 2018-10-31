import { lineString } from '@turf/helpers';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import './map.css';

(mapboxgl as any).accessToken = "pk.eyJ1IjoidHJhbnNwb3J0cGFydG5lcnNoaXAiLCJhIjoiY2ptOTN5N3Q3MHN5aDNxbGs2MzhsN3dneiJ9.K4j9mXsvfGCYtM8YouwCKg";

interface IMapState {
  selectedPoints: any,
  viewport: object
}

class Map extends React.Component<any, IMapState> {
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
      container: 'SHST-map-container',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom
    });

    this.mapContainer.on('move', this.handleMapMove);
    this.mapContainer.on('click', this.handleMapClick)
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
    const el = document.createElement('div');
    el.className = 'SHST-Map-Point-Marker';
    new mapboxgl.Marker(el)
      .setLngLat(event.lngLat)
      .addTo(this.mapContainer);
    
    if (this.state.selectedPoints.length+1 > 1) {
      const coords: any = [];
      this.state.selectedPoints.forEach((v: any) => {
        coords.push([v.lng, v.lat])
      });
      coords.push([event.lngLat.lng, event.lngLat.lat]);
      const linestring = lineString(coords);
      /* tslint:disable */
      // console.log(event.lngLat);
      console.log(linestring);
      /* tslint:enable */
      if (typeof this.mapContainer.getLayer("shst-line") !== 'undefined') {
        this.mapContainer.removeLayer("shst-line");
        this.mapContainer.removeSource("shst-line");
      }
      this.mapContainer.addSource("shst-line", {
        data: linestring,
        type: "geojson"
      });
      this.mapContainer.addLayer({
        "id": "shst-line",
        "paint": {
          "line-color": "orange",
          "line-dasharray" : [2,1],
          "line-opacity": 0.35,
          "line-width": 8,
        },
        "source": "shst-line",
        "type": "line",
      });
    }

    this.setState({
      selectedPoints: [
        ...this.state.selectedPoints,
        event.lngLat
      ]
    });
  }

  public render() {
    return (
      <div>
        <div id={'SHST-map-container'} style={{
          height: 400,
          width: '100%',
        }} />
      </div>
    );
  }
}

export default Map;