import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {TimeRange} from "../src";
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


storiesOf('Date Picker', module)
    .addDecorator(CenterDecorator)
    .add('1', () => {

        console.log(currentState);

        return <StateContainer>
            {
                (state, changeState) => {
                    return <TimeRange
                        className={"blah"}
                        from={state.from || currentState.from}
                        to={state.to || currentState.to}
                        onSelect={adaptState(changeState)}/>
                }
            }
        </StateContainer>
    });
