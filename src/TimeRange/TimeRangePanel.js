import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ScrollColumn from "./ScrollColumn";
import withMaskedTouch from "./withMaskedTouch";
import EventBoundary from "./EventBoundary";

/**
 * Panel opened when time range selected.
 */
class TimeRangePanel extends React.Component
{
    static propTypes = {
        left: PropTypes.bool,
        min: PropTypes.number,
        step: PropTypes.number,
        onChange: PropTypes.func,
        onClose: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = this._timeState(props.min);

        /** @type {number} Editting state of child components. */
        this.state.editState = 0;
    }

    componentWillMount() {
        document.addEventListener("touchstart", this._closeMe);
        document.addEventListener("mousedown", this._closeMe);
    }

    _closeMe = (e) => {
        if (this.props.onClose && !e.defaultPrevented)
            this.props.onClose();
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.min !== undefined)
            this.setState(this._timeState(nextProps.min));
    }

    /**
     * Generates time state from input minutes.
     * @param {number} min minute of date
     * @return {{pm: boolean, hr: number, min: number}}
     * @private
     */
    _timeState(min) {
        const time = {
            pm: min >= 60 * 12,
            hr: Math.floor(min / 60),
            min: min % 60
        };

        if (time.pm)
            time.hr = time.hr - 12;

        return time;
    }

    _hourChanged = (hr) => {
        this.props.onChange(hr * 60 + this.state.min + 60 * (this.state.pm ? 12 : 0));
    };

    _minChanged = (min) => {
        this.props.onChange(this.state.hr * 60 + min + 60 * (this.state.pm ? 12 : 0));
    };

    _amPmChanged = (val) => {
        this.props.onChange(this.state.hr * 60 + this.state.min + 60 * (val === 'PM' ? 12 : 0));
    };

    _setEditState = (state) => {
        this.setState({ editState: state });
    };

    render() {
        return (
            <EventBoundary className="time-range-panel" preventMouseDown preventTouchStart>
                <svg className={classNames({
                    "panel-arrow": true,
                    "arrow-left": this.props.left,
                    "arrow-right": !this.props.left
                })}>
                    <path d="M0,10 20,10 10,0z" />
                    <path d="M0,10, 10,0 20,10" />
                </svg>

                <div className="time-columns">
                    <ScrollColumn value={this.state.hr}
                                  onSelect={this._hourChanged}
                                  labels={{0: 12}}
                                  textToggle={this.state.editState === 1}
                                  entryNext={() => this._setEditState(2)} />
                    <ScrollColumn value={this.state.min}
                                  min={0}
                                  max={55}
                                  step={this.props.step}
                                  onSelect={this._minChanged}
                                  textToggle={this.state.editState === 2}
                                  entryPrev={() => this._setEditState(1)}
                                  entryNext={() => this._setEditState(3)} />
                    <ScrollColumn value={this.state.pm ? "PM" : "AM"}
                                  range={[ 'AM', 'PM' ]}
                                  onSelect={this._amPmChanged}
                                  textToggle={this.state.editState === 3}
                                  entryPrev={() => this._setEditState(2)} />
                </div>
            </EventBoundary>
        );
    }

    componentWillUnmount() {
        document.removeEventListener("touchstart", this._closeMe);
        document.removeEventListener("mousedown", this._closeMe);
    }
}

TimeRangePanel = withMaskedTouch(TimeRangePanel);
export default TimeRangePanel;