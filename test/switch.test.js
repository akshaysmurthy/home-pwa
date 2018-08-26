import React from 'react';
import { shallow } from 'enzyme';
import Switch from '../src/switch';

describe('Switch', () => {
  let switchComponent;
  const bulbHost = 'some.host';
  const roomName = 'Bedroom'

  const mockServerOnBulbAndReturn = (returnValue) => {
    global.fetch = jest.fn().mockResolvedValue({
      text: () => returnValue
    });
  };

  const triggerTouchMoveEvents = (yValues) => {
    yValues.forEach((yDisplacement) => {
      switchComponent.find('.switch-outer')
        .simulate('touchmove', {
          touches: [{ clientY: yDisplacement }]
        });
    });
  }

  beforeEach(() => {
    mockServerOnBulbAndReturn();
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  describe('on mount', () => {
    it('gets the state from the bulb', () => {
      mockServerOnBulbAndReturn('100');

      switchComponent = shallow(<Switch bulbHost={bulbHost} roomName={roomName}/>);

      return fetch().then(() => {
        switchComponent.update();
      }).then(() => {
        expect(switchComponent.state().toggleState).toEqual(100);
      });
    });
  });

  describe('on render', () => {
    beforeEach(() => {
      switchComponent = shallow(<Switch bulbHost={bulbHost} roomName={roomName}/>, {
        disableLifecycleMethods: true
      });
    });

    it('has the title', () => {
      expect(switchComponent.find('h1').text()).toEqual(roomName);
    });

    it('toggles off if the toggle state is 0', () => {
      switchComponent.setState({ toggleState: 0 });

      expect(switchComponent.find('.switch-inner').hasClass('off')).toBe(true);
    });

    it('toggles off if the toggle state is 1', () => {
      switchComponent.setState({ toggleState: 1 });

      expect(switchComponent.find('.switch-inner').hasClass('on')).toBe(true);
    });
  });

  describe('on swiping up', () => {
    beforeEach(() => {
      switchComponent = shallow(<Switch bulbHost={bulbHost} roomName={roomName}/>, {
        disableLifecycleMethods: true
      });
      triggerTouchMoveEvents([40, 30, 10]);
      switchComponent.find('.switch-outer').simulate('touchend');
    });

    it('toggles on', () => {
      expect(switchComponent.find('.switch-inner').hasClass('on')).toBe(true);
    });

    it('sends the new state to the bulb', () => {
      expect(global.fetch).toHaveBeenCalledWith(`http://${bulbHost}/set_state?state=1`);
    });
  });

  describe('on swiping down', () => {
    beforeEach(() => {
      switchComponent = shallow(<Switch bulbHost={bulbHost} roomName={roomName}/>, {
        disableLifecycleMethods: true
      });
      triggerTouchMoveEvents([10, 30, 40]);
      switchComponent.find('.switch-outer').simulate('touchend');
    });

    it('toggles on', () => {
      expect(switchComponent.find('.switch-inner').hasClass('off')).toBe(true);
    });

    it('sends the new state to the bulb', () => {
      expect(global.fetch).toHaveBeenCalledWith(`http://${bulbHost}/set_state?state=0`);
    });
  });

});
