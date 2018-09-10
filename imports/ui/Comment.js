import React, { Component } from 'react';

import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import UIWrapper from './UIWrapper.js';
import Task from './Task.js';
import Posts from './Posts.js';
import { Meteor } from 'meteor/meteor';

//import MyList from './Demo'
// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
      check:true,
      nav:true,
      showNhide:false,
      content:null
    };
  }
  render(){
      return(<div className="container">
      <header>
    <UIWrapper /> 
      <label className="hide-completed">
        <button
      onClick={()=>this.setState({check:true})}
        >Cancel</button>
         
      </label>
      <label className="hide-completed">   <button
      onClick={()=>ReactDOM.findDOMNode(this.refs.textInput).value==""?'':this.handleSubmit()}
        >Done</button></label>
     <Posts/>
     <label className="post-Title">
     <h3>Title:</h3>
          <input className="textTitle"
            type="text"
            ref="textInput"
            placeholder="Add a title for your Post"
          />
       
        </label>
        { this.props.currentUser ?'':this.setState({check:true})}
    </header>
 <div className='Body'>
 <label className="post-Title"><h2>Containt:</h2></label><textarea className="textContent"
  type="text"
  ref="Content"
  placeholder="Blog Content"/>
      </div>
      


  </div>)
  }
}