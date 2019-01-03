/**
 * Return the current timestamp in seconds.
 *
 * @return {Number} current time
 */
export function now() {
    return Math.round(new Date().getTime() / 1000);
}

/**
 * Gets the current timestamp in milliseconds.
 *
 * @return {number} current time in MS.
 */
export function nowMS() {
    return Date.now();
}

/**
 * Format a time stamp containing hours and minutes.
 *
 * @param {Date} date object
 * @return {string} formatted time
 */
export function formatTime(date) {
    return pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getSeconds(), 2);
}

/**
 * Format seconds value in a <min>:<second> value.
 *
 * @param {number} seconds now
 */
export function formatMinSec(seconds) {
    return pad(Math.floor(seconds / 60), 2) + ":" + pad(Math.round(seconds % 60), 2);
}

/**
 * Format time value in minutes to hour minute representation.
 *
 * @param {number} min minutes value
 * @param {boolean} [amPm] whether 24 hr or am/pm time
 * @return {string} formatted minutes
 */
export function formatMin(min, amPm = false) {
    let hr = Math.floor(min / 60)
    let suf;

    if (amPm)
    {
        const pm = min >= 12 * 60;
        if (pm)
        {
            hr -= 12;
            if (hr === 0) hr = 12;
            suf = " PM"
        }
        else
            suf = " AM";
    }
    else
        suf = "";

    return pad(hr, 2) + ":" + pad(min % 60) + suf;
}

/**
 * Format milliseconds to minute:second:milliseconds.
 *
 * @param {number} millis milliseconds value
 * @return {string} formatted milliseconds
 */
export function formatMillis(millis) {
    return formatMinSec(millis / 1000) + ":" + pad(millis % 1000, 3);
}

/**
 * Format seconds for nice display where it is display as a value with
 * a unit that may be 'sec' or 'min'.
 *
 * @param {Number} seconds seconds value
 * @return {String} display seconds
 */
export function formatSeconds(seconds) {
    let display = "";

    if (seconds > 60)
        display = Math.round(seconds / 60) + " min";
    else if (seconds < 0)
        display = "0 sec";
    else
        display = seconds + " sec";

    return display;
}

/**
 * Clamp value to range.
 *
 * @param {number} v value
 * @param {number} min minimum value in range
 * @param {number} max maximum value in range
 * @return {*} clamped value
 */
export function clamp(v, min, max) {
    if (v < min) return min;
    else if (v > max) return max;
    else return v;
}

/**
 * Pad value with leading zeros.
 *
 * @param {Number} val value to pad
 * @param {Number} number of digits to pad to
 */
export function pad(val, digits = 2) {
    let s = "" + val;
    while (s.length < digits) s = "0" + s;
    return s;
}

/**
 * Easing functions.
 */
export const Easing = {
    linear: function (t) {
        return t;
    },
    quinticIn: function (t) {
        return t * t * t * t * t;
    },
    quinticOut: function (t) {
        return --t * t * t * t * t + 1;
    }
};


/**
 * Random selection of values.
 */
export const Random = {
    enumerated: (values) => {
        return values[Math.floor(Math.random() * values.length)];
    },
    numeric: (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    char: () => {
        return Random.numeric(0, 1) === 1 ?
            String.fromCharCode(Random.numeric(65, 90)) :
            String.fromCharCode(Random.numeric(97, 122));
    },
    boolean: (bias) => {
        if (!bias) bias = 1;
        return Math.random() >= 1 / bias;
    },
    array: (len, min, max) => {
        const arr = new Array(len);
        for (let i = 0; i < len; i++) arr[i] = Random.numeric(min, max);
        return arr;
    }
};

