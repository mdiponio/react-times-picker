import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import {clamp} from "../utils/utility";
import {getPosition} from "../utils/events";
import Event from "./Event";

/**
 * Scrolling column.
 */
class ScrollColumn extends React.Component {
    static propTypes = {
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        range: PropTypes.array,
        value: PropTypes.any,
        labels: PropTypes.object,
        onSelect: PropTypes.func,
        textToggle: PropTypes.bool,
        entryNext: PropTypes.func,
        entryPrev: PropTypes.func
    };

    static defaultProps = {
        min: 0,
        max: 11,
        step: 1,
        labels: {},
        entryPrev: function () {},
        entryNext: function () {}
    };

    constructor(props) {
        super(props);

        this.state = {
            text: false,
            textValue: "",
            range: this.props.range ? this.props.range : this._mapRange(props.min, props.max, props.step)
        };

        /** @type {Element} Element to scroll. */
        this._element = null;

        /** @type {Number} Current scroll position. */
        this._scroll = 0;

        /** @type {Number} Offset to put selected element to mid scroll region. */
        this._offset = 0;

        /** @type {Number} Scroll position top relative to top of page. */
        this._scrollPageTop = 0;

        /** @type {Number} Height of each scroll item. */
        this._height = 0;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.min || nextProps.max || nextProps.step)
            this.setState({ range: this._mapRange(
                    nextProps.min ? nextProps.min : this.props.min,
                    nextProps.max ? nextProps.max : this.props.max,
                    nextProps.step ? nextProps.step : this.props.step
                ) });

        if (nextProps.range)
            this.setState({ range: nextProps.range });

        if (nextProps.value !== undefined)
        {
            this._calcPosition(nextProps.value);
            this._setScroll(this._scroll);
            this.setState({ textValue: "" + nextProps.value });
        }

        if (nextProps.textToggle)
            this.setState({text: true});
    }

    _mapRange(min, max, step = 1) {
        const range = [];
        for ( ; min <= max; min += step) range.push(min);
        return range;
    }

    _mounted = (e) => {
        this._element = e;
        if (!this._element) return;

        /* We need to determine size of element to offset selected element to the
         * middle of scroll box. */
        const bounds = this._element.parentNode.getBoundingClientRect();
        this._scrollPageTop = bounds.top;

        const height = bounds.height;
        this._height = this._element
            .querySelector("li:first-child")
            .getBoundingClientRect().height;

        this._offset = height / 2 - this._height / 2;

        this._calcPosition(this.props.value);
        this._setScroll(this._scroll);
    };

    /**
     * Calculate scroll position of value in range.
     *
     * @param {*} val value
     * @private
     */
    _calcPosition(val) {
        this._scroll = -this._getIndex(val) * this._height;
    }

    /**
     * Set scroll position of element.
     *
     * @param pos
     * @private
     */
    _setScroll(pos) {
        if (!this._element) return;

        pos = clamp(pos, -(this.state.range.length - 1) * this._height, 0);
        pos += this._offset;
        this._element.style.transform = "translate(0, " + pos + "px)";
    }

    /**
     * Move list up or down.
     *
     * @param {number} delta number of items to move up or down
     * @private
     */
    _move(delta) {
        let i = this._getIndex(this.props.value);
        const value = this.state.range[clamp(i + delta, 0, this.state.range.length - 1)];
        this._setValue(value);
    }

    /**
     * Sets value of column.
     *
     * @param {*} value new value
     * @private
     */
    _setValue(value) {
        if (value !== this.props.value)
            this.props.onSelect(value);
    };

    /**
     * Get index of value in range.
     *
     * @param {*} val value label
     * @return {number} index of value
     * @private
     */
    _getIndex(val) {
        const p = this.state.range.indexOf(val);
        if (p < 0)
            console.log("Value " + p + " not in Slack");
        return p >= 0 ? p : 0;
    }

    /**
     * Event handler to start scrolling list.
     *
     * @param {Event} e event object
     * @param {String} move move event name
     * @param {String} end end event name
     * @param {String} [exit] exit event name
     * @private
     */
    _scrollStart = (e, move, end, exit) => {
            const start = getPosition(e);
        let moved = false;

        const scrollMove = (e) => {
            const { y, } = getPosition(e, start.tid);
            const dt = y - start.y;

            /* May be a click if threshold movement not exceeded. */
            if (!moved && Math.abs(dt) < 5) return;

            /* Once moved, cannot become a click if the position has moved. */
            moved = true;

            this._setScroll(this._scroll + dt);
        };

        const scrollEnd = (e) => {
            document.body.removeEventListener(move, scrollMove);
            document.body.removeEventListener(end, scrollEnd);
            if (exit) document.body.removeEventListener(exit, scrollEnd);

            /* If the movement is a click / tap (i.e. the point has moved less than 5px,
             * then a click action will occur. */
            const { y, } = getPosition(e, start.tid);
            const dt = y - start.y;

            if (!moved && Math.abs(dt) < 5)
            {
                this._clicked(y);
                return;
            }

            this._scroll = Math.round(clamp(this._scroll + dt,
                -(this.state.range.length - 1) * this._height, 0) / this._height) * this._height;
            this._setScroll(this._scroll);

            const i = Math.round(-this._scroll / this._height);
            this._setValue(this.state.range[i]);
        };

        document.body.addEventListener(move, scrollMove);
        document.body.addEventListener(end, scrollEnd);
        if (exit) document.body.addEventListener(exit, scrollEnd);

    };

    /**
     * Event handler for detected 'click'.
     *
     * @param {Number} y page y of click
     * @private
     */
    _clicked = (y) => {
        const delta = Math.floor((y - this._scrollPageTop - this._offset) / this._height);

        if (delta === 0)
        {
            /* Entry text box should be visible. */
            this.setState({
                text: true,
                textValue: this.props.value
            });
        }
        else
            /* Move to the clicked number. */
            this._move(delta);
    };

    /**
     * Event handler for mouse wheel.
     *
     * @param {Event} e event
     * @private
     */
    _mouseWheel = (e) => {
        this._move(e.deltaY > 0 ? 1 : -1);
    };

    /**
     * Text mounted event handler.
     *
     * @param {Event} e event
     * @private
     */
    _textMounted = (e) => {
        if (!e) return;

        e.focus();
        e.setSelectionRange(0, e.value.length);
    };

    /**
     * Event handler when text entered changes.
     *
     * @param {Event} e event
     * @private
     */
    _textChanged = (e) => {
        let value = e.target.value;

        if (value !== "")
        {
            /* If value numeric, then cast to number as indexOf test with fail. */
            if (/^-?\d+$/.test(value.trim()))
                value = Number.parseInt(value);

            /* If value is a label, replace it with value in range. */
            for (let v in this.props.labels)
            {
                if (value === this.props.labels[v])
                {
                    value = +v;
                    break;
                }
            }

            /* Value exists in range. */
            let i = this.state.range.indexOf(value);
            if (i >= 0)
                /* Entered value in range, set to it. */
                this._setValue(value);
        }

        this.setState({ textValue: e.target.value });
    };

    /**
     * Event handled when input box is blurred - loses focus.
     *
     * @param {Event} e event
     * @private
     */
    _textBlur = (e) => {
        this._textEntryFinished(e.target.value);
    };

    /**
     * Text entry finished, attempt to correct set value.
     *
     * @param {String} value event
     * @private
     */
    _textEntryFinished = (value) => {
        /* If value numeric, then cast to number as indexOf test with fail. */
        if (!Number.isInteger(value) && /^-?\d+$/.test(value.trim()))
            value = +value;

        /* If value is a label, replace it with value in range. */
        for (let v in this.props.labels)
        {
            if (value === this.props.labels[v])
            {
                value = +v;
                break;
            }
        }

        /* If there is a step and numeric, go to the closet item. */
        if (this.props.step && Number.isInteger(value))
            value = Math.round(value / this.props.step) * this.props.step;

        const i = this.state.range.indexOf(value);
        if (i >= 0)                       // Strict match exists
            this._setValue(value);

        else if (Number.isInteger(value)) // Numeric clamped to range
            this._setValue(clamp(value, this.state.range[0], this.state.range[this.state.range.length - 1]));

        else                              // Case insensitive match
        {
            for (const v of this.state.range)
            {
                if (v instanceof String && v.toUpperCase().startsWith(value.toUpperCase()))
                {
                    this._setValue(v);
                    break;
                }
            }
        }

        this.setState({ text: false });
    };

    /**
     * Input key pressed.
     *
     * @param {KeyboardEvent} e event
     * @private
     */
    _keyPressed = (e) => {
        switch (e.keyCode) {
            case 9:  // Tab key
                e.preventDefault();
                this._textEntryFinished(this.state.textValue);
                this.props.entryNext();
                break;

            case 13: // Enter key
                this._textEntryFinished(this.state.textValue);
                break;

            case 27: // Escape key
                e.preventDefault();
                this.setState({
                    text: false,
                    textValue: this.props.value
                });
                break;

            case 37: // Key left
                this._textEntryFinished(this.state.textValue);
                this.props.entryPrev();
                break;

            case 38: // Key up
                this._move(-1);
                break;

            case 39: // Key right
                this._textEntryFinished(this.state.textValue);
                this.props.entryNext();
                break;

            case 40: // Key down
                this._move(1);
                break;

            default:
                /* No action changes. */
                break;
        }
    };

    /**
     * Get display value where the value may be replaced with a configured label.
     *
     * @param {*} v value
     * @return {*} value or label
     * @private
     */
    _displayValue = (v) => {
        return this.props.labels[v] !== undefined ? this.props.labels[v] : v;
    };

    _up = () => {
        this._move(1);
    };

    _down = () => {
        this._move(-1);
    }

    render() {
        const i = this._getIndex(this.props.value);

        return (
            <div className="scroll-column-stack">
                <Event type="button" onMouseDown={this._down} onTouchStart={this._down}
                       className={classNames({ "disabled": i === 0 })}>&#x2303;</Event>

                <div className="scroll-column">
                    <div className="scroll-clip">
                        <ul ref={this._mounted}>
                            {this.state.range.map((v, i) =>
                                <li key={i}>
                                    {this._displayValue(v)}
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="selected-region"></div>
                    <div className="selected-region-top"></div>
                    <div className="selected-region-bottom"></div>
                    <Event className="scroll-handle"
                         onMouseDown={(e) => this._scrollStart(e, "mousemove", "mouseup", "mouseleave")}
                         onTouchStart={(e) => this._scrollStart(e, "touchmove", "touchend")}
                         onWheel={this._mouseWheel}
                    ></Event>
                </div>

                {this.state.text && <input type="text"
                                           value={this._displayValue(this.state.textValue)}
                                           ref={this._textMounted}
                                           onKeyDown={this._keyPressed}
                                           onChange={this._textChanged}
                                           onBlur={this._textBlur} />}

                <Event type="button" onMouseDown={this._up} onTouchStart={this._up}
                       className={classNames({ "disabled": i === this.state.range.length - 1})}>&#x2304;</Event>
            </div>
        )
    }
}

export default ScrollColumn;