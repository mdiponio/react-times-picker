import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {formatMin} from "../utils/utility";

import TimeRangePanel from "./TimeRangePanel";
import Event from "./Event";

/**
 * Selectable time range.
 */
export class TimeRangePicker extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        from: PropTypes.number,
        to: PropTypes.number,
        step: PropTypes.number,
        maxGap: PropTypes.number,
        onSelect: PropTypes.func,
        amPm: PropTypes.bool,
        dark: PropTypes.bool
    };

    static defaultProps = {
        step: 15,
        maxGap: 24 * 60,
        className: "",
        dark: false,
        amPm: true
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            from: false,
            to: false
        };
    }

    /**
     * Opens or closed time selection panel.
     *
     * @param {boolean} from whether to open from or to panel
     * @private
     */
    _toggleOpen(from) {
        this.setState({
            open: from !== this.state.from || !this.state.open,
            from: from,
            to: !from
        })
    }

    /**
     * Event handler when minute value changed.
     *
     * @param {Number} min new minute value
     * @private
     */
    _timeChanged = (min) => {
        let from = this.state.from ? min : this.props.from;
        let to = this.state.to ? min : this.props.to;

        /* The minimum difference between from and to should be step minutes. */
        if (to - from < this.props.step)
        {
            if (to === this.props.to)
                to = from + this.props.step;
            else
                from = to - this.props.step;
        }
        else if (to - from > this.props.maxGap)
        {
            /* The maximum difference between from and to should be the set max gap. */
            if (from === this.props.from)
                from = to - this.props.maxGap;
            else
                to = from + this.props.maxGap;
        }


        if (from < 0)
        {
            to += -from;
            from = 0;
        }

        if (to >= 24 * 60)
        {
            from -= to - 24 * 60;
            to = 24 * 60;
        }

        if (from !== this.props.from || to !== this.props.to)
            this.props.onSelect(from, to);
    };

    _toggleFromOpen = (e) => {
        e.preventDefault();
        this._toggleOpen(true);
    };

    _toggleToOpen = (e) => {
        e.preventDefault();
        this._toggleOpen(false);
    };

    render() {
        const classes = {
            "time-selector": true,
            "time-selector-dark": this.props.dark,
            "time-selector-light": !this.props.dark
        };
        if (this.props.className)
            classes[this.props.className] = true;

        return (
            <div className={classNames(classes)}>
                <Event type="span" className={ classNames({"time-from": true, "open": this.state.open && this.state.from })}
                       onMouseDown={this._toggleFromOpen} onTouchStart={this._toggleFromOpen}>
                    {formatMin(this.props.from, this.props.amPm)}
                </Event>

                <svg viewBox="0 0 1000 1000">
                    <path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path>
                </svg>

                <Event type="span" className={ classNames({"time-to": true, "open": this.state.open && this.state.to })}
                       onMouseDown={this._toggleToOpen} onTouchStart={this._toggleToOpen}>
                    {formatMin(this.props.to, this.props.amPm)}
                </Event>

                {this.state.open && <TimeRangePanel left={this.state.from}
                                                    min={this.state.from ? this.props.from : this.props.to}
                                                    step={this.props.step}
                                                    onChange={this._timeChanged}
                                                    onClose={() => this.setState({open: false, from: false, to: false})}/>}
            </div>
        );
    }
}

export default TimeRangePicker;