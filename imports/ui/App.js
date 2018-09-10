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
      content:null,
      Comment:'',
      commentsArray:[]
    };
  }
 
  handleSubmit() {
   
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const text1 = ReactDOM.findDOMNode(this.refs.Content).value;
    const cmnt = this.state.commentsArray

    Meteor.call('tasks.insert', text,text1,cmnt);
    Tasks.insert({
      text,
      text1,
      cmnt,
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
  AddComment(){
    const CommentsArray =ReactDOM.findDOMNode(this.refs.Comment).value;
    const taskId = this.state.content._id
    const cmnt ={"array":CommentsArray,"createdAt": new Date(),"userId":Meteor.userId(),"username": Meteor.user().username}
    Meteor.call('tasks.cmnt',taskId,JSON.stringify(cmnt));
    Meteor.subscribe('Stuff').ready()
  }
  deleteCmnt(index){
    const taskId = this.state.content._id
      Meteor.call('tasks.removeCmnt',index,taskId);
      Meteor.subscribe('Stuff').ready()
    
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
          onPressBtn={(t)=>{this.setState({content:t}),this.setState({nav:false}),this.setState({commentsArray: t.cmnt});
          }}
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
          onClick={()=>{this.setState({nav:true}),this.setState({commentsArray:[]})}}
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
          
          <div className='Comments'>
     <label className="Comments"><h3>Comments:</h3></label>{
      this.state.commentsArray.map((item,index)=>
    {
      var a = JSON.parse(item)

      
    return( <header>
       <div  className='Comments'><strong> {JSON.stringify(a.createdAt).slice(1,11)} {a.username} : </strong>{a.array}</div>
       { Meteor.user().username == a.username ?<button className="delete" onClick={()=>this.deleteCmnt(index)}>
         Delete
        </button>:console.log(JSON.stringify(Meteor.userId()) )
        
 }
    </header>)
    })
    }

   
          </div>
  <header>
       
       {/*
       <label className="hide-completed">   <button
       onClick={()=>ReactDOM.findDOMNode(this.refs.textInput).value==""?'':this.handleSubmit()}
         >Save</button></label> */}
       

     <h3>{Meteor.user().username}</h3><textarea className="Comments"
      type="text"
      ref="Comment"
      placeholder="Comment"/>
        
      <label className="hide-completed">
            <button
          onClick={()=>ReactDOM.findDOMNode(this.refs.Comment).value=""}
            >Clear</button>
             
          </label>
    <label className="hide-completed">
         <button
       onClick={()=>{this.setState({Comment:ReactDOM.findDOMNode(this.refs.Comment).value}),this.AddComment(),ReactDOM.findDOMNode(this.refs.Comment).value=""}}
         >Add Comment</button>
          
       </label>
     
      <label className="post-Title">
      <h3></h3>
           {/* <input className="textTitle"
             type="text"
             ref="textInput"
             placeholder="Add a title for your Post"
           /> */}
        
         </label>
         { this.props.currentUser ?'':this.setState({check:true})}
       
     </header>
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