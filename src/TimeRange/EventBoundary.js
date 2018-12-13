import PropTypes from "prop-types";
import EventMapper from "./EventMapper";

/**
 * Component to prevent native events bubbling past this element.
 */
class EventBoundary extends EventMapper
{
    static propTypes = {
        children: PropTypes.array,
        type: PropTypes.string,

        preventClick: PropTypes.bool,
        preventContextMenu: PropTypes.bool,
        preventDblClick: PropTypes.bool,
        preventMouseDown: PropTypes.bool,
        preventMouseEnter: PropTypes.bool,
        preventMouseLeave: PropTypes.bool,
        preventMouseMove: PropTypes.bool,
        preventMouseOver: PropTypes.bool,
        preventMouseOut: PropTypes.bool,
        preventMouseUp: PropTypes.bool,
        preventPointerOver: PropTypes.bool,
        preventPointerEnter: PropTypes.bool,
        preventPointerDown: PropTypes.bool,
        preventPointerMove: PropTypes.bool,
        preventPointerUp: PropTypes.bool,
        preventPointerCancel: PropTypes.bool,
        preventPointerOut: PropTypes.bool,
        preventPointerLeave: PropTypes.bool,
        preventTouchCancel: PropTypes.bool,
        preventTouchEnd: PropTypes.bool,
        preventTouchEnter: PropTypes.bool,
        preventTouchLeave: PropTypes.bool,
        preventTouchMove: PropTypes.bool,
        preventTouchStart: PropTypes.bool,
        preventSelect: PropTypes.bool,
        preventWheel: PropTypes.bool
    };

    static defaultProps = {
        type: "div"
    };

    constructor(props) {
        super(props, [
            "preventClick",
            "preventContextMenu",
            "preventDblClick",
            "preventMouseDown",
            "preventMouseEnter",
            "preventMouseLeave",
            "preventMouseMove",
            "preventMouseOver",
            "preventMouseOut",
            "preventMouseUp",
            "preventPointerOver",
            "preventPointerEnter",
            "preventPointerDown",
            "preventPointerMove",
            "preventPointerUp",
            "preventPointerCancel",
            "preventPointerOut",
            "preventPointerLeave",
            "preventTouchCancel",
            "preventTouchEnd",
            "preventTouchEnter",
            "preventTouchLeave",
            "preventTouchMove",
            "preventTouchStart",
            "preventSelect",
            "preventWheel"
        ], "prevent".length, function(e) {
            e.preventDefault();
        });
    }
}

export default EventBoundary;