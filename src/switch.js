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

  handleClick() {
    const newToggleState = +!this.state.toggleState;
    this.setState(() => ({
      toggleState: newToggleState
    }));
    setTimeout(() => {
      fetch(`http://${this.props.bulbHost}/set_state?state=${newToggleState}`);
    }, 100);
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
        <div className='switch-outer' onClick={this.handleClick.bind(this)}>
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
