import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';


import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchBar from "material-ui-search-bar";
import CancelIcon from '@material-ui/icons/Cancel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress'

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
  suggestButton: {
    position: 'absolute',
    right: 0,
    marginRight: theme.spacing(1),
  },
  cardRoot: {
    width: '100%',
  },
  modalImageButtonLeft: {
    maxWidth: '10%',
  },
  moadlImageButtonRight: {
    maxWidth: '10%',
  },
  loadingCircle: {
    maxWidth: '50%',
    maxHeight: '50%'
  }
}));


const buildPopup = (title, image) => {
  let popupHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">`
  popupHTML += `<strong>${title}</strong>`
  popupHTML += image ? `<img src=\"${image}\" style="max-width: 30vmin; max-height: 25vmin;"/>` : ''
  popupHTML += `</div>`
  return popupHTML;
}

function parseTuple(t) {
  var items = t.replace(/^\(|\)$/g, "").split("),(");
  items.forEach(function(val, index, array) {
    array[index] = val.split(",").map(Number);
  });
  return items[0].reverse();
}

function mod(n, m) {
  return ((n % m) + m) % m;
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
        mapRef.current.setFeatureState({source: 'locations', id: location.location_id}, { filtered: false });
      })
      if (filterUsed) {
        filteredLocations.forEach(location => {
          mapRef.current.setFeatureState({source: 'locations', id: location.location_id}, { filtered: true });
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
            id={"location-" + location.location_id}
            onMouseDown={() => history.replace(location.name)}
          >
            <div className="cardButtonContainer">
              <div 
                className={"cardButton" + (filterUsed ? " filterUsed" : "")}
                onMouseEnter={() => {
                  if(!mapRef.current) return;
                  const coordinates = location.coordinates;
                  const popupHTML = buildPopup(location.name, location.images[0]);
                  var popup = new mapboxgl.Popup({
                    closeButton:  false,
                    closeOnClick: false,
                  });
    
                  mapRef.current.flyTo({ center: coordinates, esssential: true, speed: 0.35 })
                  mapRef.current.fire('closeAllPopups');
                  popup.setLngLat(coordinates).setHTML(popupHTML).addTo(mapRef.current);
                  mapRef.current.setFeatureState({source: 'locations', id: location.location_id}, { hover: true });
                  mapRef.current.on('closeAllPopups', () => {
                    popup.remove();
                  });
                }
              }
              onMouseLeave={() => {
                  mapRef.current.fire('closeAllPopups');
                  mapRef.current.setFeatureState({source: 'locations', id: location.location_id}, { hover: false });
                }
              }
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
  const [lng, setLng] = useState(-73.6573);
  const [lat, setLat] = useState(45.5017);
  const [zoom, setZoom] = useState(10);
  const [open, setOpen] = useState(false);
  const [mapboxStyle, setMapboxStyle] = useState('mapbox://styles/mapbox/streets-v11');

  const [locations, setLocations] = useState([]);


  const toggleMapType = () => {
    const newMapType = mapboxStyle === 'mapbox://styles/mapbox/streets-v11' ? 
    'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v11';
    setMapboxStyle(newMapType);
  }

  useEffect(() => {
    axios.get('https://secretcities.xyz:3000/locations')
    .then((resp) => {
      const locations = resp.data.map(location => ({
        ...location,
        coordinates: parseTuple(location.coordinates),
      }))
      setLocations(locations);
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

    const topRightButtons = document.getElementsByClassName("mapboxgl-ctrl-top-right")[0].children[0];
    const button = document.createElement("button");
    button.addEventListener('click', () => toggleMapType());
    button.innerHTML = `<button class="mapboxgl-cntrl-style" type="button" title="Toggle Map Style" style="display: flex;justify-content: center;align-items: center;"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M13.144 8.171c-.035-.066.342-.102.409-.102.074.009-.196.452-.409.102zm-2.152-3.072l.108-.031c.064.055-.072.095-.051.136.086.155.021.248.008.332-.014.085-.104.048-.149.093-.053.066.258.075.262.085.011.033-.375.089-.304.171.096.136.824-.195.708-.176.225-.113.029-.125-.097-.19-.043-.215-.079-.547-.213-.68l.088-.102c-.206-.299-.36.362-.36.362zm13.008 6.901c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12s5.372-12 12-12c6.627 0 12 5.373 12 12zm-8.31-5.371c-.006-.146-.19-.284-.382-.031-.135.174-.111.439-.184.557-.104.175.567.339.567.174.025-.277.732-.063.87-.025.248.069.643-.226.211-.381-.355-.13-.542-.269-.574-.523 0 0 .188-.176.106-.166-.218.027-.614.786-.614.395zm6.296 5.371c0-1.035-.177-2.08-.357-2.632-.058-.174-.189-.312-.359-.378-.256-.1-1.337.597-1.5.254-.107-.229-.324.146-.572.008-.12-.066-.454-.515-.605-.46-.309.111.474.964.688 1.076.201-.152.852-.465.992-.038.268.804-.737 1.685-1.251 2.149-.768.694-.624-.449-1.147-.852-.275-.211-.272-.66-.55-.815-.124-.07-.693-.725-.688-.813l-.017.166c-.094.071-.294-.268-.315-.321 0 .295.48.765.639 1.001.271.405.416.995.748 1.326.178.178.858.914 1.035.898.193-.017.803-.458.911-.433.644.152-1.516 3.205-1.721 3.583-.169.317.138 1.101.113 1.476-.029.433-.37.573-.693.809-.346.253-.265.745-.556.925-.517.318-.889 1.353-1.623 1.348-.216-.001-1.14.36-1.261.007-.094-.256-.22-.45-.353-.703-.13-.248-.015-.505-.173-.724-.109-.152-.475-.497-.508-.677-.002-.155.117-.626.28-.708.229-.117.044-.458.016-.656-.048-.354-.267-.646-.53-.851-.389-.299-.188-.537-.097-.964 0-.204-.124-.472-.398-.392-.564.164-.393-.44-.804-.413-.296.021-.538.209-.813.292-.346.104-.7-.082-1.042-.125-1.407-.178-1.866-1.786-1.499-2.946.037-.19-.114-.542-.048-.689.158-.352.48-.747.762-1.014.158-.15.361-.112.547-.229.287-.181.291-.553.572-.781.4-.325.946-.318 1.468-.388.278-.037 1.336-.266 1.503-.06 0 .038.191.604-.019.572.433.023 1.05.749 1.461.579.211-.088.134-.736.567-.423.262.188 1.436.272 1.68.069.15-.124.234-.93.052-1.021.116.115-.611.124-.679.098-.12-.044-.232.114-.425.025.116.055-.646-.354-.218-.667-.179.131-.346-.037-.539.107-.133.108.062.18-.128.274-.302.153-.53-.525-.644-.602-.116-.076-1.014-.706-.77-.295l.789.785c-.039.025-.207-.286-.207-.059.053-.135.02.579-.104.347-.055-.089.09-.139.006-.268 0-.085-.228-.168-.272-.226-.125-.155-.457-.497-.637-.579-.05-.023-.764.087-.824.11-.07.098-.13.201-.179.311-.148.055-.287.126-.419.214l-.157.353c-.068.061-.765.291-.769.3.029-.075-.487-.171-.453-.321.038-.165.213-.68.168-.868-.048-.197 1.074.284 1.146-.235.029-.225.046-.487-.313-.525.068.008.695-.246.799-.36.146-.168.481-.442.724-.442.284 0 .223-.413.354-.615.131.053-.07.376.087.507-.01-.103.445.057.489.033.104-.054.684-.022.594-.294-.1-.277.051-.195.181-.253-.022.009.34-.619.402-.413-.043-.212-.421.074-.553.063-.305-.024-.176-.52-.061-.665.089-.115-.243-.256-.247-.036-.006.329-.312.627-.241 1.064.108.659-.735-.159-.809-.114-.28.17-.509-.214-.364-.444.148-.235.505-.224.652-.476.104-.178.225-.385.385-.52.535-.449.683-.09 1.216-.041.521.048.176.124.104.324-.069.19.286.258.409.099.07-.092.229-.323.298-.494.089-.222.901-.197.334-.536-.374-.223-2.004-.672-3.096-.672-.236 0-.401.263-.581.412-.356.295-1.268.874-1.775.698-.519-.179-1.63.66-1.808.666-.065.004.004-.634.358-.681-.153.023 1.247-.707 1.209-.859-.046-.18-2.799.822-2.676 1.023.059.092.299.092-.016.294-.18.109-.372.801-.541.801-.505.221-.537-.435-1.099.409l-.894.36c-1.328 1.411-2.247 3.198-2.58 5.183-.013.079.334.226.379.28.112.134.112.712.167.901.138.478.479.744.74 1.179.154.259.41.914.329 1.186.108-.178 1.07.815 1.246 1.022.414.487.733 1.077.061 1.559-.217.156.33 1.129.048 1.368l-.361.093c-.356.219-.195.756.021.982 1.818 1.901 4.38 3.087 7.22 3.087 5.517 0 9.989-4.472 9.989-9.989zm-11.507-6.357c.125-.055.293-.053.311-.22.015-.148.044-.046.08-.1.035-.053-.067-.138-.11-.146-.064-.014-.108.069-.149.104l-.072.019-.068.087.008.048-.087.106c-.085.084.002.139.087.102z"></path></svg></button>'`
    topRightButtons.insertBefore(button, topRightButtons.firstChild);

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
                "id": location.location_id,
                'properties': {
                  'title': location.name,
                  'image': location.images[0],
                },
                'geometry': {
                  'type': 'Point',
                  'coordinates': location.coordinates
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
        history.push(e.features[0].properties.title);
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
          MTLSECRETS
        </div>
        <Button size='small' variant='contained' onClick={() => history.push('suggest')} className={classes.suggestButton}>
          Suggest
        </Button>
      </div>
      <div className="topSpacer"></div>
      <div className="mainContent">
        <MemoizedSidebar open={open} locations={locations} mapRef={mapRef}/>
        <RouterSwitch>
          <Route exact path="/MTLsecrets/suggest">
            <SuggestionPage/>
          </Route> 
          <Route path="/MTLsecrets/:locationName">
            <Modal locations={locations}/>
          </Route>
        </RouterSwitch>
       </div>
       <div ref={mapContainer} className="map-container"/>
    </>
  );
}


const SuggestionPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [state, setState] = useState(0); // 0 is filling out, 1 is loading, 2 is finished

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('coordinates', '(123, -123)');
    setState(1);
    axios.post("https://secretcities.xyz:8080/suggestion", formData, {headers: {'content-type': 'multipart/form-data'}})
    .then(res => { 
        setState(2);
      })
  }

  const loadFile = function(event) {
    var imagePreviews = document.getElementById('imagePreviews');
    imagePreviews.innerHTML = '';
    for (let i = 0; i < event.target.files.length; i++) {
      let img = new Image();
      img.className = 'suggestionImage'
      img.src = URL.createObjectURL(event.target.files[i]);
      img.onload = function() {
        URL.revokeObjectURL(img.src);
        imagePreviews.appendChild(img);
      }
    }
  };

  if (state == 1) {
    return (
      <div className="modal suggestionScreen">
        <IconButton
        className={classes.modalCancelButton}
        onClick={() => {
          if (!title && !description && !coordinates) {
            history.replace('/MTLsecrets/');
          } else {
            if (window.confirm('Exiting will result in losing your work, are you sure?')) {
              history.replace('/MTLsecrets/');
            }
          }
        }}
        >
            <CancelIcon className={classes.modalCancelIcon}/>
        </IconButton>
        <div className="loadingCircle">
          <CircularProgress className={classes.loadingCircle}/>
        </div>
      </div>
    )
  }

  if (state == 2) {
    return (
      <div className="modal suggestionScreen">
        <IconButton
        className={classes.modalCancelButton}
        onClick={() => {
          if (!title && !description && !coordinates) {
            history.replace('/MTLsecrets/');
          } else {
            if (window.confirm('Exiting will result in losing your work, are you sure?')) {
              history.replace('/MTLsecrets/');
            }
          }
        }}
        >
            <CancelIcon className={classes.modalCancelIcon}/>
        </IconButton>
        <div className="suggestionFinishedText">
          Suggestion has been submitted. Thank you for being an active Edmontontonian!
        </div>
      </div>
    )
  }

  return (
    <div className="modal suggestionScreen">
      <div className="modalTitle">
        Suggest Location
        <IconButton
        className={classes.modalCancelButton}
        onClick={() => {
          if (!title && !description && !coordinates) {
            history.replace('/MTLsecrets/');
          } else {
            if (window.confirm('Exiting will result in losing your work, are you sure?')) {
              history.replace('/MTLsecrets/');
            }
          }
        }}
        >
            <CancelIcon className={classes.modalCancelIcon}/>
        </IconButton>
      </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="suggestionForm">
            <div className="suggestionTitle"> 
              <div>Title</div>
              <input type="text" id="title" name="title" onChange={(e) => setTitle(e.target.value)}></input> 
            </div>
            <div className="suggestionDescription"> 
              <div>Description</div>
              <textarea type="text" id="description" name="description" onChange={(e) => setDescription(e.target.value)}></textarea> 
            </div>
            <div className="suggestionImages"> 
              <div>Images</div>
              <label htmlFor="image" className="imagesButton">&nbsp;&nbsp;&nbsp;Upload Images&nbsp;&nbsp;&nbsp;</label>
              <input type="file" id="image" name="image" accept="image/*" multiple onChange={loadFile}  style={{ display: "none" }}/>
              <div id="imagePreviews"></div>
            </div>
            
            <button type="submit">Submit Suggestion</button>
          </div>
        </form>
    </div>
  )
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
          history.replace('/MTLsecrets/')
        }}
        >
            <CancelIcon className={classes.modalCancelIcon}/>
        </IconButton>
      </div>
      <div className="modalImagesContainer">
        { location.images.length > 1 ?
        <IconButton
          className={classes.modalImageButtonLeft}
          onClick={() => setImageIndex(prev => mod(prev - 1, location.images.length || 1))}
        >
          <ChevronLeftIcon className={classes.modalImageButtonIcon}/>
        </IconButton>
        :
        null
        }
        <img className="modalImage" src={location.images[imageIndex]}/>
        { location.images.length > 1 ?
        <IconButton
          className={classes.modalImageButtonRight}
          onClick={() => setImageIndex(prev => mod(prev + 1, location.images.length || 1))}
        >
          <ChevronRightIcon className={classes.modalImageButtonIcon}/>
      </IconButton>
      :
      null
      }
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
