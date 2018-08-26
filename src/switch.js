import React from 'react';
import PropTypes from 'prop-types';

export default class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { toggleState: 0 };
  }

  componentDidMount() {
    this.getToggleState().then((responseText) => {
      this.setState({ toggleState: parseInt(responseText) });
    });
  }

  getToggleState() {
    return fetch(`http://${this.props.bulbHost}/status`)
      .then(response => response.text());
  }

  setToggleState(newToggleState) {
    this.setState({ toggleState: newToggleState });
    fetch(`http://${this.props.bulbHost}/set_state?state=${newToggleState}`);
  }

  handleTouchMove(event) {
    this.touches = this.touches || [];
    this.touches = [...this.touches, ...event.touches];
  }

  handleTouchEnd() {
    const yValues = this.touches.map(touch => touch.clientY);
    const verticalDisplacement = yValues[0] - yValues[yValues.length - 1];
    this.setToggleState(verticalDisplacement > 0 ? 1 : 0)
  }

  render() {
    const { toggleState, roomName } = {
      ...this.state,
      ...this.props
    };
    const toggleStateClassName = toggleState === 1 ? 'on' : 'off';
    const wallClassName = toggleState === 1 ? 'bright' : 'dark';
    return (
      <div className={`wall ${wallClassName}`}>
        <h1>{roomName}</h1>
        <div className='switch-outer' onTouchMove={this.handleTouchMove.bind(this)} onTouchEnd={this.handleTouchEnd.bind(this)}>
          <div className={`switch-inner ${toggleStateClassName}`}>
          </div>
        </div>
      </div>
    )
  }
}

Switch.propTypes = {
  roomName: PropTypes.string.isRequired,
  bulbHost: PropTypes.string.isRequired
}
