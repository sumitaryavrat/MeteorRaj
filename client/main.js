// Client entry point, imports all client code

import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.js';

Meteor.startup(() => {
  ReactDOM.render(<App />, document.getElementById('app'));
});