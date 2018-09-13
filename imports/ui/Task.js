import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import classnames from 'classnames';
import Pagination from "react-js-pagination";
// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }
 
  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }
  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames({
        checked: this.props.task.checked,
        private: this.props.task.private,
      });
 
    return (
          <li className={taskClassName}>
           { this.props.showPrivateButton ?<button className="delete" onClick={()=>this.props.editPress(this.props.task)}>
         Edit
        </button>:''
 }
       { this.props.showPrivateButton ?<button className="delete" onClick={this.deleteThisTask.bind(this)}>
         Delete
        </button>:''
 }
        {/* <input
          type="checkbox"
          readOnly
          checked={!!this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        /> */}
 {/* { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''} */}

 <button className="toggle-private" onClick={()=>this.props.onPressBtn(this.props.task)}><span className="text">
 <strong>{JSON.stringify(this.props.task.createdAt).slice(1,11)}:- {this.props.task.username}</strong>: {this.props.task.text}
        </span></button>
      </li>
    );
  }
}