import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {formatMin} from "../utils/utility";

import TimeRangePanel from "./TimeRangePanel";
import Event from "./Event";

/**
 * Time picker component.
 */
export class TimePicker extends React.Component
{
    static propTypes = {
        className: PropTypes.string,
        time: PropTypes.number,
        onSelect: PropTypes.func,
        step: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    _toggleOpen = (e) => {
        e.preventDefault();
        this.setState({ open: !this.state.open });
    };

    render() {
        return (
            <div className={"time-selector " + this.props.className}>
                <Event type="span" className={ classNames({"open": this.state.open })}
                       onMouseDown={this._toggleOpen} onTouchStart={this._toggleOpen}>
                    {formatMin(this.props.time)}
                </Event>

                {this.state.open && <TimeRangePanel left
                                                    min={this.props.time}
                                                    step={this.props.step}
                                                    onChange={this.props.onSelect}
                                                    onClose={() => this.setState({open: false})}/>}
            </div>
        )
    }
}