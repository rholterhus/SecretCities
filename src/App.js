import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';


import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchBar from "material-ui-search-bar";


const axios = require('axios');
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

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
  },
  cardRoot: {
    width: '100%',
  }
}));


const Sidebar = ({open, locations, mapRef}) => {

  const [filter, setFilter] = useState('');
  const [allPopups, setAllPopups] = useState([]);

  const filteredLocations = locations.filter(location => {
    return location.name.toLowerCase().includes(filter.toLowerCase());
  })

  return (
    <div className="sidebar" style={{ marginLeft: open ? "0%" : "-25%"}}>
      <SearchBar
        onChange={(e) => setFilter(e)}
        onCancelSearch={() => setFilter('')}
        style={{
          position: 'fixed',
          width: '25%'
        }}
      />
      <div className="cards">
        {filteredLocations.map(location => 
          <div 
            className={"cardBase " + (('acknowledgement_name' in location) ? "suggestionCard" : "originalCard")} 
            onMouseOver={() => {
              if(!mapRef.current) return;
              const coordinates = [location.longitude, location.latitude];
              const popupHTML = `<strong>${location.name}</strong>`
              var popup = new mapboxgl.Popup({
                closeButton:  false,
                closeOnClick: false
              });

              mapRef.current.flyTo({ center: coordinates, esssential: true })
              popup.setLngLat(coordinates).setHTML(popupHTML).addTo(mapRef.current);
              setAllPopups(prev => [...prev, popup]);
            }
          }
            onMouseLeave={() => {
              allPopups.forEach(popup => popup.remove());
            }}
          >
            <div className="cardTitle">
              {location.name}  
            </div>
            <br/>
            <div className="cardDescription">
              {location.description.slice(0, 100)}  
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


const MemoizedSidebar = React.memo(Sidebar);



function App() {

  const classes = useStyles();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
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
    mapRef.current = map

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.on('load', () => {
       
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
                  'title': location.name,
                  'description': '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
                  'suggestion': 'acknowledgement_name' in location,
                  'image': location.images[0]
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

      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
        closeButton:  false,
        closeOnClick: false
      });

      var hoveredID = null;

      map.on('mousemove', 'locations', (e) => {

        map.getCanvas().style.cursor = 'pointer';
        var coordinates = e.features[0].geometry.coordinates.slice();
        var popupHTML = `<strong>${e.features[0].properties.title}</strong>`

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
         
        popup.setLngLat(coordinates).setHTML(popupHTML).addTo(map);

        if (e.features.length > 0) {
          if (hoveredID) {
            map.setFeatureState({
              source: 'locations',
              id: hoveredID,
            }, {
              hover: false
            });
          }
          hoveredID = e.features[0].id;
          map.setFeatureState({
            source: 'locations',
            id: hoveredID,
          }, {
            hover: true
          });

      }
    });

    map.on("mouseleave", "locations", function() {
      if (hoveredID != null) {
        map.setFeatureState({
          source: 'locations',
          id: hoveredID
        }, {
          hover: false
        });
      }
      hoveredID = null;
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
            {open ? <MenuIcon className={classes.menuIcon}/> : <ChevronRightIcon className={classes.menuIcon}/> }
        </IconButton>
        <div className="logo">
          YEGSECRETS
        </div>
        <Switch color="secondary" onChange={toggleMapType} className={classes.switch}/>
      </div>
      <div className="topSpacer"></div>
      <div className="mainContent">
        <MemoizedSidebar open={open} locations={locations} mapRef={mapRef}/>
        <div ref={mapContainer} className="map-container"/>
      </div>
    </>
  );
}

export default App;
