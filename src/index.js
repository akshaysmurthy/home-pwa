import React from 'react';
import { render } from 'react-dom';
import App from './app';
import Switches from './switches.json';
import "./sass/main.scss";

render(
  <App switches={Switches}/>,
  document.getElementById('app-container')
);
