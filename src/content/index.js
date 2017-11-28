import React from 'react';
import { render } from 'react-dom';

// Relative imports
import App from './components/App';

// Import style
import './style.css';

// Create app root element
document.body.insertAdjacentHTML(
  'afterbegin',
  '<div id="react-chrome-extension-boilerplate"></div>'
);

// Render
render(<App />, document.querySelector('#react-chrome-extension-boilerplate'));
