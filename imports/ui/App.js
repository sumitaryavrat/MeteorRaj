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
      showNhide:false
    };
  }
 
  handleSubmit() {
   
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call('tasks.insert', text);
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
    
  }
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
       
      return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }
 
  render() {
    
    return (
      this.state.check?<div className="container">
       <header style={{justifyContent:'space-between',height:'20%'}}>
        <UIWrapper /> 
        <h1>List of blog-Post ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <button
          onClick={()=>{ this.props.currentUser ?this.setState({check:false}):alert("Please Log in first")}}
            >Write a blog</button>
            
          </label>
         
          {/* { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form>
             : ''
          } */}
         
        </header>
 
        <ul>
        {this.renderTasks()}
        </ul>
 </div>:<div className="container">
          <header>
        <UIWrapper /> 
          <label className="hide-completed">
            <button
          onClick={()=>this.setState({check:true})}
            >Cancel</button>
             
          </label>
          <label className="hide-completed">   <button
          onClick={()=>ReactDOM.findDOMNode(this.refs.textInput).value==""?'':this.handleSubmit()}
            >Save</button></label>
         <Posts/>
         <label className="post-Title">
         Title:
              <input
                type="text"
                ref="textInput"
                placeholder="Add a title for your Post"
              />
           
            </label>
            { this.props.currentUser ?'':this.setState({check:true})}
        </header>
     <div className='Body'>
          </div>
          


      </div>
     );
    }
  }
   
  export default withTracker(() => {
    Meteor.subscribe('tasks');
    return {
      tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
      incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
      currentUser: Meteor.user(),
    };
  })(App);