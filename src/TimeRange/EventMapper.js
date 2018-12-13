import React from "react";

/**
 * Event handling base.
 */
class EventMapper extends React.PureComponent
{
    static defaultProps = {
        type: "div"
    };

    constructor(props, events, prefix, handler = null) {
        super(props);

        /** @type{Array[String]}Event handlers added. */
        this._added = [];

        /** @type {Element} Mounted DOM element. */
        this._element = null;

        /** @type {Array[String] List of event properties. */
        this.events = events;

        /** @type {Function} Event handler to apply. */
        this._commonHandler = handler;

        /** @type {Number} prefix length. */
        this._prefix = prefix;
    }

    componentWillReceiveProps(nextProps) {
        if (this._element)
            this._updateHandlers(nextProps)
    }

    /**
     * Event mounted when element mounted.
     *
     * @param {Element} e element
     * @private
     */
    _mounted = (e) => {
        this._element = e;
        if (this._element)
            this._updateHandlers(this.props);
        else
            this._added = [];
    };

    /**
     * Updates handlers applied to element to match those that should be set.
     *
     * @param {Object} props properties of component
     * @private
     */
    _updateHandlers(props) {
        for (const k in props)
        {
            if (this.events.indexOf(k) >= 0)
            {
                if (props[k]) // true if event handler should be masked
                {
                    if (this._added.indexOf(k) < 0)
                    {
                        this._element.addEventListener(this._eventName(k), this._handler(props, k));
                        this._added.push(k);
                    }
                }
                else
                {
                    const p = this._added.indexOf(k);
                    if (p >= 0)
                    {
                        this._element.removeEventListener(this._eventName(k), this._handler(props, k));
                        this._added.splice(p, 1);
                    }
                }
            }
        }
    }

    _eventName(k) {
        return k.substring(this._prefix).toLowerCase();
    }

    _handler(props, k) {
        return this._commonHandler ? this._commonHandler : props[k];
    }

    render() {
        const elementProps = Object.assign({}, this.props);

        /* Remove properties from child. */
        delete elementProps.children;
        delete elementProps.type;

        for (let k in elementProps)
            if (this.events.indexOf(k) >= 0) delete elementProps[k];

        elementProps.ref = this._mounted;
        return React.createElement(this.props.type, elementProps, this.props.children);
    }

    componentWillUnmount() {
        if (this._element)
        {
            for (const k of this._added)
                this._element.removeEventListener(this._eventName(k), this._handler(this.props, k));
        }

        this._added = [];
    }
}

export default EventMapper;