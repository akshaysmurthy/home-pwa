import React from 'react';
import PropTypes from 'prop-types';
import Switch from './switch';

export default class App extends React.Component {  
  render() {
    return (
      <div id="app">
        <h1>Home</h1>
        <div className="switches-container">
          {
            this.props.switches.map((switchObj, i) => {     
              return (
                <Switch key={i} bulbHost={switchObj.bulbHost} roomName={switchObj.roomName}/>
              );
            })
          }
        </div>
      </div>
    )
  }
}

App.propTypes = {
  switches: PropTypes.arrayOf(PropTypes.shape({
    roomName: PropTypes.string.isRequired,
    bulbHost: PropTypes.string.isRequired,
  })).isRequired,
}