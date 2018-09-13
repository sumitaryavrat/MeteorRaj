
import React, { Component } from 'react';
import Pagination from "react-js-pagination";
import { withTracker } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
import UIWrapper from './UIWrapper.js';
import Task from './Task.js';
import { Meteor } from 'meteor/meteor';
import SyntaxHighlighter from "react-syntax-highlighter";
import { sunburst } from "react-syntax-highlighter/dist/styles/hljs";
import "bootstrap3/less/bootstrap.less";
import {Card,Badge,ListGroup} from 'bootstrap3'
  class App extends Component {
      constructor(props) {
        super(props);
 this.state = {
      hideCompleted: false,
      check:true,
      nav:true,
      showNhide:false,
      content:null,
      edit:false,
      title:'',
      contentData:'',
      Comment:'',
      commentsArray:[],
      index:null,
      activePage: 1,
      start:0,
      end:8
    };
  }
 
  handleSubmit() {
   
      const text = this.state.title;
      const text1 =this.state.contentData;
      const cmnt = this.state.commentsArray
      this.state.edit?Meteor.call('tasks.update',text,text1,this.state.content._id):
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
        this.setState({edit:false})
        this.setState({title:''})
        this.setState({contentData:''})
        }
        toggleHideCompleted() {
            this.setState({
            hideCompleted: !this.state.hideCompleted,
          });
    
  }
  AddComment(){
    const CommentsArray =this.state.Comment;
    const taskId = this.state.content._id
    const cmnt ={"array":CommentsArray,"createdAt": new Date(),"userId":Meteor.userId(),"username": Meteor.user().username}
    this.state.edit?Meteor.call('tasks.updateCmnt',taskId,JSON.stringify(cmnt),this.state.index):Meteor.call('tasks.cmnt',taskId,JSON.stringify(cmnt));
    Meteor.subscribe('tasks').ready()
    this.setState({edit:false})
    const task = Tasks.findOne(taskId);
    this.setState({commentsArray: task.cmnt})
  }
  deleteCmnt(index){
      const taskId = this.state.content._id
      Meteor.call('tasks.removeCmnt',index,taskId);
      Meteor.subscribe('tasks').ready()
      const task = Tasks.findOne(taskId);
      this.setState({commentsArray: task.cmnt})
    
  }
  updateCmnt(index,data){
    this.setState({Comment:data})
    this.setState({edit:true})
    this.setState({index:index})

  } handlePageChange(pageNumber) {
    this.setState({start:(pageNumber*8)-8})
    this.setState({end:pageNumber*8})
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }
  renderTasks() {
      let filteredTasks = this.props.tasks;
      if (this.state.hideCompleted) {
          filteredTasks = filteredTasks.filter(task => !task.checked);
        }
      return filteredTasks.slice(this.state.start,this.state.end).map((task) => 
        {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = task.owner === currentUserId;
       return (
        <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton}
          editPress={(t)=>{
            this.setState({edit:true}),
            this.setState({content:t}),
            this.setState({check:false}),
            this.setState({title:t.text}),
            this.setState({contentData:t.text1})
          }}
          onPressBtn={(t)=>{
            this.setState({content:t}),
            this.props.currentUser ?this.setState({nav:false}):
             alert("Please Log in first"),
            this.setState({commentsArray: t.cmnt});
          }}
        />
      );
    });
  }
  handleChange (text) {
    this.setState({title:text.target.value})
  }
  handleChange1 (text) 
  {
    this.setState({contentData:text.target.value})
  }
  handleChange2 (text) 
  {
    this.setState({Comment:text.target.value})
  }
  render() {
      const hideFirstLastPages = `render() {
        return (<Pagination
        activePage={this.state.activePage}
        itemsCountPerPage={8}
        totalItemsCount={this.props.tasks.length}
        pageRangeDisplayed={this.props.tasks.length>=2?2:1}
        onChange={(pageNumber)=>this.handlePageChange(pageNumber)}
      />)}`
    return (
      this.state.nav? this.state.check?<div className="container">
          <header style={{justifyContent:'space-between',height:'20%'}}>
            <UIWrapper /> 
            <h1>Post Management Tool</h1>
            <label className="hide-completed">
              <button type="button" className="btn btn-secondary"
                onClick={()=>{ this.props.currentUser ?this.setState({check:false}):alert("Please Log in first")}}
                >Write a blog
              </button>
            </label>
         </header>
        <h2>
          <span className="badge badge-secondary">
              <h5>List of blog-Post ({this.props.incompleteCount})</h5>
          </span>
        </h2>
        <ul className="list-group">
            {this.renderTasks()}
        </ul>
        <header>{this.props.tasks.length>8?
            <div className="panel-body">
                <div className='text-center'>
                  <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={8}
                    totalItemsCount={this.props.tasks.length}
                    pageRangeDisplayed={this.props.tasks.length>=2?2:1}
                    onChange={(pageNumber)=>this.handlePageChange(pageNumber)}
                  />
                </div>
              </div>:''}
        </header>
  </div>:
    <div className="container">
        <header>
          <UIWrapper/> 
            <label className="hide-completed">
              <button
                onClick={()=>this.setState({check:true})}
                >Cancel
              </button>
            </label>
            <label className="hide-completed">
              <button
                  onClick={()=> this.state.title==""?'':this.handleSubmit()}
                  >Save
              </button>
            </label>
            <label className="post-Title">
                <h3>Title:</h3>
                <input className="textTitle"
                  type="text"
                  id="textInput"
                  ref="textInput"
                  value={this.state.title}
                  onChange={(text)=> {this.handleChange(text)}}
                  placeholder="Add a title for your Post"
                />
           </label>
          { this.props.currentUser ?'':this.setState({check:true})}
        </header>
      <div className='Body'>
        <label className="post-Title">
          <h2>Containt:</h2>
        </label>
        <textarea className="textContent"
          type="text"
          ref="Content"
          value={this.state.contentData}
          onChange={(text)=> {this.handleChange1(text)}}
          placeholder="Blog Content"/>
      </div>
  </div>:<div className="container">
           <header>
              <label className="hide-completed">
                  <button
                    onClick={()=>{
                      this.setState({nav:true}),
                      this.setState({commentsArray:[]})
                    }}
                    >Back
                  </button>
              </label> 
              <label className="post-Title">
                <h3>Writer: {this.state.content.username}</h3>
               </label>
              { this.props.currentUser ?'':this.setState({check:true})}
            </header>
            <div className='Body'>
                <div className="card" >
                  <div className="card-body">
                    <h3 className="card-title">
                      {this.state.content.text}
                    </h3>
                     <p className="card-text">{this.state.content.text1}</p>
                   </div>
                </div>
          </div>
         <div className='Comments'>
         <label className="Comments">
           <h3>Comments:</h3>
         </label>{
            this.state.commentsArray.map((item,index)=>
               {
                    var a = JSON.parse(item)
                    return( <header>
                          <div  className='Comments'>
                            <strong> {JSON.stringify(a.createdAt).slice(1,11)} {a.username} :
                           </strong>{a.array}</div>
                          { Meteor.user().username == a.username ?
                            <button className="delete" 
                              onClick={()=>this.updateCmnt(index,a.array)}>
                                  edit
                            </button>:''
                          }
                          { Meteor.user().username == a.username ?
                              <button className="delete" 
                                  onClick={()=>this.deleteCmnt(index)}>
                                      Delete
                              </button>:''
                          }
                      </header>)
              })
            }
        </div>
        <header>
            <h3>{Meteor.user().username}</h3>
            <textarea 
              className="Comments"
              type="text"
              ref="Comment"
              placeholder="Comment"
              value={this.state.Comment}
              onChange={(text)=> {
                      this.handleChange2(text)
                      }}
            />
       <label className="hide-completed">
          <button type="button" className="btn btn-secondary"
              onClick={()=>this.setState({Comment:""})}
            >Clear</button>
       </label>
       <label className="hide-completed">
         <button type="button" className="btn btn-secondary"
            onClick={()=>{
              this.AddComment(),
              this.setState({Comment:""})
              }}
          >Add Comment</button>
      </label>
      <label className="post-Title">
      </label>
         { this.props.currentUser ?'':this.setState({check:true})}
       </header>
  </div>);
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
