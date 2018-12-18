import React from "react";

/**
 * Masks touch input.
 *
 * @param WrappedComponent
 * @return {Component} wrapped component
 */
export default function withMaskedTouch(WrappedComponent) {
    return class extends React.Component {
        /**
         * Event handler to mask touch page bounce.
         *
         * @param {TouchEvent} e event
         * @private
         */
        _maskTouch = (e) => {
            e.preventDefault();
        };

        componentWillMount() {
            document.addEventListener("touchmove", this._maskTouch, { passive: false });
        }

        componentWillUnmount() {
            document.removeEventListener("touchmove", this._maskTouch);
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}