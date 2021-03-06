import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const cities = [
  {
    name: 'montreal',
    id: 1,
    coordinates: [-73.6073, 45.5017],
  },
  {
    name: 'vancouver',
    id: 2,
    coordinates: [-123.1207, 49.2827],
  },
  {
    name: 'calgary',
    id: 3,
    coordinates: [-114.0719, 51.0447],
  }
]


ReactDOM.render(
  <React.StrictMode>
    <div class="allWrapper">
      <Router>
        <Switch>
          {cities.map(city => 
            <Route path={`/${city.name}`} key={city.name}>
                <App city={city.name} coordinates={city.coordinates} id={city.id}/>
            </Route>
          )}
          <Route exact path='/'>
            {cities.map(city => 
              <div key={city.name}>
                <a href={`${city.name}`}>{city.name}</a>
                <br/>
              </div>
            )}
          </Route>
        </Switch>
      </Router>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
