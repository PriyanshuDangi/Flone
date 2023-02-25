import React, { forwardRef, useRef } from 'react';
import Boxman from './Boxman';
import * as boxmanActions from './boxmanActions';

const Player = forwardRef((props, ref) => {
    let {
        position = [0, 0, 0],
        quaternion = [0, 0, 0, 1],
        scale = [6, 6, 6],
        avatarType = 'Adventurer',
        action = boxmanActions.idle,
    } = props;

    const anotherRef = useRef();

    return (
        <Boxman
            ref={ref ? ref : anotherRef}
            position={position}
            quaternion={quaternion}
            scale={scale}
            avatarType={avatarType}
            action={action}
        />
    );
});

export default Player;
