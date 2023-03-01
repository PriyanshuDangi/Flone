import React, { useState, useEffect } from 'react';
import { Joystick } from 'react-joystick-component';

const initialState = {
    left: false,
    right: false,
    forward: false,
    backward: false,
};

const diff = 22.5;

const TouchJoystick = ({ setMovement }) => {
    const [direction, setDirection] = useState('');
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        if (direction !== '' || direction !== 'stop') {
            setMovement({ ...initialState, [direction]: true });
        } else if (direction === 'stop') {
            setMovement(initialState);
        }
    }, [direction]);

    // useEffect(() => {
    //     if ((angle > 0 && angle < 90 - diff) || (angle > 270 + diff && angle < 360)) {
    //         setMovement((prev) => {
    //             return { ...initialState, right: true, left: false };
    //         });
    //     } else {
    //         setMovement((prev) => {
    //             return { ...initialState, right: false };
    //         });
    //     }
    //     if (angle > 0 + diff && angle < 180 - diff) {
    //         setMovement((prev) => {
    //             return { ...initialState, forward: true, backward: false };
    //         });
    //     } else {
    //         setMovement((prev) => {
    //             return { ...initialState, forward: false };
    //         });
    //     }
    //     if (angle > 90 + diff && angle < 270 - diff) {
    //         setMovement((prev) => {
    //             return { ...initialState, left: true, right: false };
    //         });
    //     } else {
    //         setMovement((prev) => {
    //             return { ...initialState, left: false };
    //         });
    //     }
    //     if (angle > 180 + diff && angle < 360 - diff) {
    //         setMovement((prev) => {
    //             return { ...initialState, backward: true, forward: false };
    //         });
    //     } else {
    //         setMovement((prev) => {
    //             return { ...initialState, backward: false };
    //         });
    //     }
    //     if (angle == 0) {
    //         setMovement(initialState);
    //     }
    // }, [angle]);

    const getAngle = (x, y) => {
        var theta = Math.atan2(y, x); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
        if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
    };

    const action = (action, value) => {
        if (action === 'move') {
            // const angle = getAngle(value.x, value.y);
            // setAngle(angle);
            setDirection(value.direction.toLowerCase());
        } else if (action === 'stop') {
            setMovement(initialState);
            setDirection('');
        } else {
            setDirection('');
        }
    };

    return (
        <Joystick
            size={100}
            throttle={200}
            move={(value) => action('move', value)}
            stop={(value) => action('stop', value)}
            minDistance={20}
            baseColor={'rgba(0,0,0,0.2)'}
            stickColor={'rgba(0,0,0,0.5)'}
        />
    );
};

export default TouchJoystick;
