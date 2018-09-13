import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tasks } from '../api/tasks.js';
import classnames from 'classnames';
import Pagination from "react-js-pagination";
import {Buttons} from 'bootstrap3'
export default class Task extends Component {
 
    toggleChecked() {
      Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }
    deleteThisTask() {
      Meteor.call('tasks.remove', this.props.task._id);
    }
    togglePrivate() {
      Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
    }
    render() {
        const taskClassName = classnames({
            checked: this.props.task.checked,
            private: this.props.task.private,
            });
        return (
           <li className="list-group-item list-group-item-light">
              { 
                this.props.showPrivateButton ?<button className="delete" 
                onClick={()=>
                           this.props.editPress(this.props.task)
                       }>Edit</button>:''
              }          
              { 
                this.props.showPrivateButton ?<button className="delete" 
                onClick={
                         this.deleteThisTask.bind(this)
                      }>Delete</button>:''
              }
              <button type="button" className="btn btn-secondary"  onClick={()=>this.props.onPressBtn(this.props.task)}>
                  <span className="text">
                    <strong>{JSON.stringify(this.props.task.createdAt).slice(1,11)}:- {this.props.task.username}
                    </strong>:{this.props.task.text}
                  </span>
              </button>
            </li>
    );
  }
}