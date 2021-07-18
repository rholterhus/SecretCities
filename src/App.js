import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';


import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchBar from "material-ui-search-bar";
import CancelIcon from '@material-ui/icons/Cancel';


import ImageGallery from 'react-image-gallery';


import { Switch as RouterSwitch, Route, Link, useRouteMatch, useParams, useHistory} from 'react-router-dom';


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
  modalCancelButton: {
    position: 'absolute',
    right: 0,
  },
  modalCancelIcon: {
    fill: 'black',
    width: "35px",
    height: "35px"
  },
  switch: {
    position: 'absolute',
    right: 0,
    top: 0,
    margin: theme.spacing(0.5),
  },
  cardRoot: {
    width: '100%',
  },
  modalImageButton: {
    maxWidth: '10%',
  },
  modalImageButtonIcon: {
    maxWidth: '10%',
  },
}));


const buildPopup = (title, image) => {
  let popupHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">`
  popupHTML += `<strong>${title}</strong>`
  popupHTML += image ? `<img src="https://s3-us-west-2.amazonaws.com/yeg-secrets/${image}\" style="max-width: 30vmin; max-height: 25vmin;"/>` : ''
  popupHTML += `</div>`
  return popupHTML;
}


const Sidebar = ({open, locations, mapRef}) => {

  const [filter, setFilter] = useState('');
  const history = useHistory();

  const filterUsed = /[a-zA-Z]/g.test(filter);

  const filteredLocations = locations.filter(location => {
    return !filterUsed || location.name.toLowerCase().includes(filter.toLowerCase());
  })

  useEffect(() => {
    if (mapRef.current != null) {
      locations.forEach(location => {
        mapRef.current.setFeatureState({source: 'locations', id: location.id}, { filtered: false });
      })
      if (filterUsed) {
        filteredLocations.forEach(location => {
          mapRef.current.setFeatureState({source: 'locations', id: location.id}, { filtered: true });
        })
      }
    }
  }, [filter]);

  return (
    <div className={"sidebar " + (open ? "open" : "closed")}>
      <SearchBar
        onChange={(e) => setFilter(e)}
        onCancelSearch={() => setFilter('')}
        style={{
          width: '100%',
          borderRadius: 0,
          borderBottom: '1px solid black',
          boxShadow: 'none',
          backgroundColor: '#f5f5f5',
        }}
      />
      <div className="cards" id="cards">
        {filteredLocations.map(location => 
          <div 
            className="cardBase"
            id={"location-" + location.id}
            onPointerDown={() => history.replace('/yegsecretsUAT/' + location.name)}
          >
            <div className="cardButtonContainer">
              <div 
                className="cardButton"
                style={{backgroundColor: filterUsed ? '#ff00ff' : 'red'}}
                onMouseEnter={() => {
                  if(!mapRef.current) return;
                  const coordinates = [location.longitude, location.latitude];
                  const popupHTML = buildPopup(location.name, location.images[0]);
                  var popup = new mapboxgl.Popup({
                    closeButton:  false,
                    closeOnClick: false,
                  });
    
                  mapRef.current.flyTo({ center: coordinates, esssential: true, speed: 0.35 })
                  mapRef.current.fire('closeAllPopups');
                  popup.setLngLat(coordinates).setHTML(popupHTML).addTo(mapRef.current);
                  mapRef.current.on('closeAllPopups', () => {
                    popup.remove();
                  });
                }
              }
              onMouseLeave={() => mapRef.current.fire('closeAllPopups')}
              >
              </div>
            </div> 
            <div className="cardTitle">{location.name}</div>
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
  const history = useHistory();
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
          'data': {
            'type': 'FeatureCollection',
            'features': locations.map(location => {
              return {
                'type': 'Feature',
                "id": location.id,
                'properties': {
                  'title': location.name,
                  'description': '<strong>Make it Mount Pleasant</strong><p>Make it Mount Pleasant is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
                  'image': location.images[0],
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
              ['boolean', ['feature-state', 'hover'], false], '#000',
              ['boolean', ['feature-state', 'filtered'], false], '#ff00ff',
              '#ff0000',
            ],
            'circle-radius': 10,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#000000'
          }
        });


      });

      var popup = new mapboxgl.Popup({
        closeButton:  false,
        closeOnClick: false,
      });

      var hoveredID = null;

      map.on('mousedown', 'locations', (e) => {
        history.push('yegsecretsUAT/' + e.features[0].properties.title);
      })

      map.on('mousemove', 'locations', (e) => {

        map.getCanvas().style.cursor = 'pointer';
        let coordinates = e.features[0].geometry.coordinates.slice();
        let popupHTML = buildPopup(e.features[0].properties.title, e.features[0].properties.image);

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        mapRef.current.fire('closeAllPopups');
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
            {open ? <ChevronLeftIcon className={classes.menuIcon}/> : <MenuIcon className={classes.menuIcon}/> }
        </IconButton>
        <div className="logo">
          YEGSECRETS
        </div>
        <Switch color="secondary" onChange={toggleMapType} className={classes.switch}/>
      </div>
      <div className="topSpacer"></div>
      <div className="mainContent">
        <MemoizedSidebar open={open} locations={locations} mapRef={mapRef}/>
        <RouterSwitch>
          <Route path="/yegsecretsUAT/:locationName">
            <Modal locations={locations}/>
          </Route> 
        </RouterSwitch>
       </div>
       <div ref={mapContainer} className="map-container"/>
    </>
  );
}



const Modal = ({ locations }) => {
  const classes = useStyles();
  const history = useHistory();
  let { locationName } = useParams();
  const locationIndex = locations.map(l => l.name).indexOf(locationName);
  const location = locations[locationIndex];

  const [imageIndex, setImageIndex] = useState(0);

  if (!location) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modalTitle">
        {location.name}
        <IconButton
        className={classes.modalCancelButton}
        onClick={() => {
          history.replace('/yegsecretsUAT')
        }}
        >
            <CancelIcon className={classes.modalCancelIcon}/>
        </IconButton>
      </div>
      <div className="modalImagesContainer">
        <img className="modalImage" src={`https://s3-us-west-2.amazonaws.com/yeg-secrets/${location.images[imageIndex]}`}/>
        {/* <IconButton
          className={classes.modalImageButton}
          onClick={() => setImageIndex(prev => (prev - 1) % (location.images.length || 1))}
          >
          <ChevronLeftIcon className={classes.modalImageButtonIcon}/>
        </IconButton> */}
        
        {/* <IconButton
          className={classes.modalImageButton}
          onClick={() => setImageIndex(prev => (prev + 1) % (location.images.length || 1))}
          >
          <ChevronRightIcon className={classes.modalImageButtonIcon}/>
      </IconButton> */}
      </div>
      <div className="modalDescriptionContainer">
        <div className="modalDescription">
          {location.description}
        </div>
      </div>
    </div>
  )
}

export default App;
