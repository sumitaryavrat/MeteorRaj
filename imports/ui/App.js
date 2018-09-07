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
 
  handleSubmit() {
   
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const text1 = ReactDOM.findDOMNode(this.refs.Content).value;

    Meteor.call('tasks.insert', text,text1);
    Tasks.insert({
      text,
      text1,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.Content).value ='';
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
          onPressBtn={(t)=>{this.setState({content:t}),this.setState({nav:false})}}
        />
      );
    });
  }
 
  render() {
    
  
 return (
  this.state.nav? this.state.check?<div className="container">
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
          


      </div>:<div className="container">
          <header>
       
          <label className="hide-completed">
            <button
          onClick={()=>this.setState({nav:true})}
            >Back</button>
             
          </label> {/*
          <label className="hide-completed">   <button
          onClick={()=>ReactDOM.findDOMNode(this.refs.textInput).value==""?'':this.handleSubmit()}
            >Save</button></label> */}
          <label className="post-Title">

        <h3>Writer: {this.state.content.username}</h3></label>
      
         <label className="post-Title">
         <h3>{this.state.content.text}</h3>
              {/* <input className="textTitle"
                type="text"
                ref="textInput"
                placeholder="Add a title for your Post"
              /> */}
           
            </label>
            { this.props.currentUser ?'':this.setState({check:true})}
        </header>
     <div className='Body'>
     <label className="post-Title"></label><div className="textShow"
    >{this.state.content.text1}</div>
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