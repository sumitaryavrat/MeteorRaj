import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
export const Tasks = new Mongo.Collection('tasks');
if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [
              { private: { $ne: true } },
              { owner: this.userId },
            ],
          });
    });
  }
Meteor.methods({
    'tasks.insert'(text,text1,cmnt) {
      check(text, String);
      check(text1, String);
      check(cmnt,Array);
      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
   
      Tasks.insert({
        text,
        text1,
        cmnt,
        createdAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
      });
    },
    'tasks.remove'(taskId) {
      check(taskId, String);
      const task = Tasks.findOne(taskId);
      if (task.private && task.owner !== this.userId) {
        // If the task is private, make sure only the owner can delete it
        throw new Meteor.Error('not-authorized');
      }
      Tasks.remove(taskId);
    },
    'tasks.removeCmnt'(index,taskId) {
      check(taskId, String);
      const task = Tasks.findOne(taskId);
      // if (task.private && task.owner !== this.userId) {
      //   // If the task is private, make sure only the owner can delete it
      //   throw new Meteor.Error('not-authorized');
      // }
      const cmnt = task.cmnt
      cmnt.splice(index, 1);
      Tasks.update(taskId, { $set: { cmnt: cmnt} });
    },
    'tasks.setChecked'(taskId, setChecked) {
      check(taskId, String);
      check(setChecked, Boolean);
      const task = Tasks.findOne(taskId);
      if (task.private && task.owner !== this.userId) {
        // If the task is private, make sure only the owner can check it off
        throw new Meteor.Error('not-authorized');
      }
      Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.cmnt'(taskId,newCmnt) {
        check(taskId, String);
        check(newCmnt, String);
     
        const task = Tasks.findOne(taskId);
        const a = task.cmnt
        a.push(newCmnt)
        // Make sure only the task owner can make a task private
        // if (task.owner !== this.userId) {
        //   throw new Meteor.Error('not-authorized');
        // }
     
        Tasks.update(taskId, { $set: { cmnt: a } });
      },
      'tasks.updateCmnt'(taskId,newCmnt,index) {
        check(taskId, String);
        check(newCmnt, String);
     
        const task = Tasks.findOne(taskId);
        const a = task.cmnt
        a[index] = newCmnt
        // Make sure only the task owner can make a task private
        // if (task.owner !== this.userId) {
        //   throw new Meteor.Error('not-authorized');
        // }
     
        Tasks.update(taskId, { $set: { cmnt: a } });
      },
      'tasks.update'(text,text1,taskId) {
        check(text, String);
        check(text1, String);
     console.log(text);
     
        const task = Tasks.findOne(taskId);
      //  task.text =text,

       // a.push(newCmnt)
        // Make sure only the task owner can make a task private
        // if (task.owner !== this.userId) {
        //   throw new Meteor.Error('not-authorized');
        // }
     
        Tasks.update(taskId, { $set: { text:text,text1:text1} });
      },
  });