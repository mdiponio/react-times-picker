/**
 * Position object.
 */
class Position {
    constructor(y, tid = 0) {
        /** @type {number} Y position. */
        this.y = y;

        /** @type {number} Touch identifier if touch event. */
        this.tid = tid;
    }
}

/**
 * Get position of touch.
 *
 * @param {MouseEvent|TouchEvent} event event object
 * @param {Position} [p] touch identifier if a touch event
 * @return {Position} page Y position
 * @private
 */
export function getPosition(event, p) {
    if (event.pageY)                                                 // Mouse event
        return new Position(event.pageY);
    else if (event.targetTouches && event.targetTouches.length > 0)  // Touch event
    {
        if (p && p.tid) {
            /* Use position of initial touch. */
            for (let t of event.targetTouches) {
                if (t.identifier === p.tid)
                    return new Position(t.pageY, p.tid);
            }
        } else {
            /* As no touch is stored, we use the first registered touch. */
            return new Position(event.targetTouches[0].pageY, event.targetTouches[0].identifier);
        }
    } else if (event.changedTouches && event.changedTouches.length > 0)
        return new Position(event.changedTouches[0].pageY);
    else {
        console.error("Event does not have position or touch position.", event);
        return new Position(0);
    }
}