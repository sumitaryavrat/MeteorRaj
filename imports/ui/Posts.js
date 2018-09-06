import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

// Task component - represents a single todo item
export default class Posts extends Component {
 
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS

 
    return (
         <div><h1>write your posts here</h1></div>
    );
  }
}