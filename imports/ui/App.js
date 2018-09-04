import React, { Component } from 'react';
import AddEvent from './AddEvent';
// we import withTracker and Events into our app file
import { withTracker } from 'meteor/react-meteor-data';
import { Events } from "../api/events";

class EventApp extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  render() {
    return (
      <div>
        <AddEvent />
        <div className="container">
        <header>
          <h1>Todo List</h1>
 
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>
        </header>
 
       </div>
      
        {/* <pre>DB Stuff: {JSON.stringify(this.props, null, ' ')} </pre> */}
      </div>
    );
  }
}

// Wrap `EventApp` with the HOC withTracker and call the new component we get `App`
const App = withTracker(() => {
  return {
    events: Events.find({}). fetch()
  }
})(EventApp);

// export the component `App`
export default App;