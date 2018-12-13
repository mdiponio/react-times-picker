import PropTypes from "prop-types";
import EventMapper from "./EventMapper";

/**
 * Component to prevent native events bubbling past this element.
 */
class Event extends EventMapper
{
    static propTypes = {
        type: PropTypes.string,

        onClick: PropTypes.func,
        onContextMenu: PropTypes.func,
        onDblClick: PropTypes.func,
        onMouseDown: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onMouseMove: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
        onMouseUp: PropTypes.func,
        onPointerOver: PropTypes.func,
        onPointerEnter: PropTypes.func,
        onPointerDown: PropTypes.func,
        onPointerMove: PropTypes.func,
        onPointerUp: PropTypes.func,
        onPointerCancel: PropTypes.func,
        onPointerOut: PropTypes.func,
        onPointerLeave: PropTypes.func,
        onTouchCancel: PropTypes.func,
        onTouchEnd: PropTypes.func,
        onTouchEnter: PropTypes.func,
        onTouchLeave: PropTypes.func,
        onTouchMove: PropTypes.func,
        onTouchStart: PropTypes.func,
        onSelect: PropTypes.func,
        onWheel: PropTypes.func
    };

    /** @type {Array[String]} Dictionary of events. */
    static events = [
        "onClick",
        "onContextMenu",
        "onDblClick",
        "onMouseDown",
        "onMouseEnter",
        "onMouseLeave",
        "onMouseMove",
        "onMouseOver",
        "onMouseOut",
        "onMouseUp",
        "onPointerOver",
        "onPointerEnter",
        "onPointerDown",
        "onPointerMove",
        "onPointerUp",
        "onPointerCancel",
        "onPointerOut",
        "onPointerLeave",
        "onTouchCancel",
        "onTouchEnd",
        "onTouchEnter",
        "onTouchLeave",
        "onTouchMove",
        "onTouchStart",
        "onSelect",
        "onWheel"
    ];

    static defaultProps = {
        type: "div"
    };

    constructor(props) {
        super(props, Event.events, "on".length);
    }
}

export default Event;