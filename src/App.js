import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';

const axios = require('axios');


mapboxgl.accessToken = 'pk.eyJ1IjoiaG9sdGVyaHVzIiwiYSI6ImNrOWhkem96ZDB3Z2EzZ25hM3NhMXRuY2QifQ._wWey2Tkg64i1vzd1tUIoQ';


const useStyles = makeStyles((theme) => ({
  menuButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: theme.spacing(1),
  },
  menuIcon: {
    fill: 'white'
  },
  switch: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: theme.spacing(1),
  }
}));



function App() {

  const classes = useStyles();
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(-113.4938);
  const [lat, setLat] = useState(53.5461);
  const [zoom, setZoom] = useState(10);
  const [open, setOpen] = useState(true);
  const [mapboxStyle, setMapboxStyle] = useState('mapbox://styles/mapbox/streets-v11');

  const [locations, setLocations] = useState([]);



  const toggleMapType = () => {
    const newMapType = mapboxStyle === 'mapbox://styles/mapbox/streets-v11' ? 
    'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v11';
    setMapboxStyle(newMapType);
  }

  useEffect(() => {
    const originalsPromise = axios.get('https://v1.api.yegsecrets.ca/location/all');
    const suggestionsPromise = axios.get('http://api.yegsecrets.ca/suggestions/limited');
    Promise.all([originalsPromise, suggestionsPromise]).then(([originals, suggestions]) => {
      setLocations([...originals.data, ...suggestions.data]);
    });

  }, []);

  
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapboxStyle,
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on('load', () => {
      // Load an image from an external URL.
        map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/cat.png', (error, image) => {
          if (error) throw error;
          // Add the image to the map style.
          map.addImage('cat', image);
       
          // Add a data source containing one point feature.
          map.addSource('locations', {
            'type': 'geojson',
            'generateId': true,
            'data': {
              'type': 'FeatureCollection',
              'features': locations.map(location => {
                return {
                  'type': 'Feature',
                  "id": location.id,
                  'properties': {
                    'description': '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
                    'suggestion': 'acknowledgement_name' in location
                  },
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [location.longitude, location.latitude]
                  }
                }
              })
            }
          });
      
          map.addLayer({
            'id': 'locations',
            'type': 'circle',
            'source': 'locations',
            'paint': {
              'circle-color': [
                'case',
                ['boolean',['feature-state', 'hover'], false], '#000',
                ['boolean',['get', 'suggestion'], false], '#ff0000',
                '#00ff00',
              ],
              'circle-radius': 10,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff'
            }
          });


        });
      });

      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
        closeButton:  false,
        closeOnClick: false
      });

      var quakeID = null;

      map.on('mousemove', 'locations', (e) => {

        map.getCanvas().style.cursor = 'pointer';
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        popup.setLngLat(coordinates).setHTML(description).addTo(map);

        if (e.features.length > 0) {
          if (quakeID) {
            map.setFeatureState({
              source: 'locations',
              id: quakeID,
            }, {
              hover: false
            });
          }
          quakeID = e.features[0].id;
          map.setFeatureState({
            source: 'locations',
            id: quakeID,
          }, {
            hover: true
          });

      }
    });

    map.on("mouseleave", "locations", function() {
      if (quakeID != null) {
        map.setFeatureState({
          source: 'locations',
          id: quakeID
        }, {
          hover: false
        });
      }
      quakeID = null;
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
      
    return () => map.remove();
  }, [locations, mapboxStyle]);


  return (
    <>
      <div className="topbar">
        <IconButton
          className={classes.menuButton}
          onClick={() => setOpen(prev => !prev)}
        >
            <MenuIcon className={classes.menuIcon}/>
        </IconButton>
        <div className="logo">
          YEGSECRETS
        </div>
        <Switch color="secondary" onChange={toggleMapType} className={classes.switch}/>
      </div>
      <div className="topSpacer"></div>
      <div className="mainContent">
        <div className="sidebar" style={{ width: open ? "25%" : 0}}>
        </div>
        <div ref={mapContainer} className="map-container"/>
      </div>
    </>
  );
}

export default App;
