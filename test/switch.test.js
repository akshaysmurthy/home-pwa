import React from 'react';
import { shallow } from 'enzyme';
import Switch from '../src/switch';

describe('Switch', () => {
  let switchComponent;
  const bulbHost = 'some.host';
  const roomName = 'Bedroom'

  const mockFetchAndReturn = (returnValue) => {
    fetch = jest.fn().mockImplementation(() => {
      return new Promise((resolve, reject) => {
        resolve({ text: () => returnValue });
      });
    });
  };

  describe('on mount', () => {
    it('gets the state from the bulb', () => {
      mockFetchAndReturn('100');

      switchComponent = shallow(<Switch bulbHost={bulbHost} roomName={roomName}/>);

      return fetch().then(() => {
        switchComponent.update();
      }).then(() => {
        expect(switchComponent.state().toggleState).toEqual(100);
      });
    });
  });

  describe('after render', () => {
    beforeEach(() => {
      switchComponent = shallow(<Switch bulbHost={bulbHost} roomName={roomName}/>);
    });

    it('has the title', () => {
      expect(switchComponent.find('h1').text()).toEqual(roomName);
    });

    it('toggles off if the toggle state is 0', () => {
      switchComponent.setState({ toggleState: 0 });

      expect(switchComponent.find('.switch-inner.off').exists()).toBe(true);
    });

    it('toggles off if the toggle state is 1', () => {
      switchComponent.setState({ toggleState: 1 });

      expect(switchComponent.find('.switch-inner.on').exists()).toBe(true);
    });
  });

  describe('on click', () => {
    beforeEach(() => {
      mockFetchAndReturn('0');
      switchComponent = shallow(<Switch bulbHost={bulbHost} roomName={roomName}/>);
      switchComponent.setState({ toggleState: 1 });
      switchComponent.find('.switch-outer').simulate('click');
    });

    it('toggles its state', () => {
      expect(switchComponent.state().toggleState).toEqual(0);
    });

    it('sends the new state to the bulb', () => {
      jest.runAllTimers();

      expect(global.fetch).toHaveBeenCalledWith(`http://${bulbHost}/set_state?state=0`);
    });

  });

});
