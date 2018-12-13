# (awesome) React Times

An awesome time picker for React!

  * TimePicker - pick a minute of day
  * TimeRangePicker - pick a time range in a day
  
## Test it out

```
$ git clone https://github.com/mdiponio/react-times.git

$ npm install

$ npm run storybook
```

### Using it
 
Using DateTimePicker

```jsx harmony
import React from "react";

import { TimePicker } from "@euvs/time_picker";

// Import CSS
import "@euvs/time_picker/dist/style.css";

class Example extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            time: 0,  // Minute of day from 0 to 24 * 60
        }        
    }
        
    render() {
        return (
            <TimePicker time={this.state.time} onSelect={(time) => this.setState({ time })} />
        );
    }
}
```
  
Using TimeRangePicker 
```jsx harmony
import React from "react";

import { TimeRangePicker } from "@euvs/time_picker";

// Import CSS
import "@euvs/time_picker/dist/style.css";

class ExampleRange extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            from: 0,  // Beginning time, minute of day from 0 to 24 * 60
            to: 0,    // End time
        }        
    }
        
    render() {
        return (
            <TimeRangePicker to={this.state.from} from={this.state.to} onSelect={(from, to) => this.setState({ from, to })} />
        );
    }
}
```

