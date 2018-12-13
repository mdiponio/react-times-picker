import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {TimeRangePicker, TimePicker} from "../src";

import "../src/TimeRange/ScrollColumn.css";
import "../src/TimeRange/TimeRange.css";


const styles = {

};
const CenterDecorator = (storyFn) => (
    <div style={styles}>
        {storyFn()}
    </div>
);

class StateContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    changeState = (newState) => {
        console.log(newState);
        this.setState(newState)
    };

    render() {
        const state = this.state;
        return this.props.children(this.state, this.changeState);
    }

}

let currentState = {
    from: 1080,
    to: 1140
};

const adaptState = (cb) => (from, to) => {
    currentState.from = from;
    currentState.to = to;

    action("new state")(currentState);
    cb(currentState)
};


storiesOf('Time Ranger Picker', module)
    .addDecorator(CenterDecorator)
    .add('default', () => {
        return <StateContainer>
            {
                (state, changeState) => {
                    return <TimeRangePicker
                        className={"blah"}
                        from={state.from || currentState.from}
                        to={state.to || currentState.to}
                        step={5}
                        onSelect={adaptState(changeState)}/>
                }
            }
        </StateContainer>
    });


storiesOf('Time Picker', module)
    .addDecorator(CenterDecorator)
    .add('default', () => {

        console.log(currentState);

        return <StateContainer>
            {
                (state, changeState) => {
                    return <TimePicker
                        className={"blah"}
                        time={state.from || currentState.from}
                        step={5}
                        onSelect={adaptState(changeState)}/>
                }
            }
        </StateContainer>
    });
