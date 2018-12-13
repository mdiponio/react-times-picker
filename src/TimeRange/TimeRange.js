import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {formatMin} from "../utils/utility";

import TimeRangePanel from "./TimeRangePanel";

/**
 * Selectable time range.
 */
export class TimeRange extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        from: PropTypes.number,
        to: PropTypes.number,
        step: PropTypes.number,
        onSelect: PropTypes.func
    };

    static defaultProps = {
        step: 15
    };

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            from: false,
            to: false
        };

        /** @type {boolean} Whether event handler was assigned for each event handler. */
        this._assignedFrom = false;
        this._assignedTo = false;
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
            {
                /* From changed. */
                if (from < 24 * 60)
                    to = from + this.props.step;
                else
                {
                    to = 24 * 60;
                    from = to - this.props.step;
                }
            }
            else
            {
                if (to >= this.props.step)
                    from = to - this.props.step;
                else
                {
                    from = 0;
                    to = this.props.step;
                }
            }

        }

        if (from !== this.props.from || to !== this.props.to)
            this.props.onSelect(from, to);
    };

    _assignClick = (n, from) => {
        if (!n || (from && this._assignedFrom) || (!from && this._assignedTo)) return;

        const handler = (e) => {
            e.preventDefault();
            this._toggleOpen(from);
        };

        n.addEventListener("mousedown", handler);
        n.addEventListener("touchstart", handler);

        if (from) this._assignedFrom = true;
        if (!from) this._assignedTo = true;
    };

    render() {
        return (
            <div className={"time-selector " + this.props.className}>
                <span className={ classNames({"time-from": true, "open": this.state.open && this.state.from })}
                      ref={n => this._assignClick(n, true)}>
                    {formatMin(this.props.from)}
                </span>
                <svg viewBox="0 0 1000 1000">
                    <path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"></path>
                </svg>
                <span className={ classNames({"time-to": true, "open": this.state.open && this.state.to })}
                      ref={n => this._assignClick(n, false)}>
                    {formatMin(this.props.to)}
                </span>

                {this.state.open && <TimeRangePanel left={this.state.from}
                                                    min={this.state.from ? this.props.from : this.props.to}
                                                    step={this.props.step}
                                                    onChange={this._timeChanged}
                                                    onClose={() => this.setState({open: false, from: false, to: false})}/>}
            </div>
        );
    }
}

export default TimeRange;