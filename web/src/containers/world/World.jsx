import { Canvas } from '@react-three/fiber';
import Ground from '../../components/three/ground/Ground';
import Ocean from '../../components/three/Ocean/Ocean';
import { OrbitControls } from '@react-three/drei';
import CameraControlsWalk from '../../components/three/controls/CameraControls';
import { nanoid } from 'nanoid';

import * as boxmanActions from '../../components/three/player/boxmanActions';
import socket from '../../utils/socket/socket';

// import {Perf} from "r3f-perf"
import * as THREE from 'three';
import Players from '../../components/three/players/Players';
import { useEffect, useState } from 'react';
import Cubes from '../../components/three/Cubes/Cubes';
import { useSelector } from 'react-redux';
import { selectCubesNFT } from '../../store/reducers/cubesNFTSlice';

let initialState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    // jump: false,
    // shift: false,
};

const World = (props) => {

    const cubesData = useSelector(selectCubesNFT);
    // const cubesData = [];

    const [controlsType, setControls] = useState('move');
    const [userId, setUserId] = useState(nanoid());
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0, z: 0 });
    const [userName, setUserName] = useState(props.userName);
    const [avatar, setAvatar] = useState(props.avatar);
    const [roomId, setRoomId] = useState(props.roomId);
    const [walking, setWalking] = useState(false);
    const [movement, setMovement] = useState(initialState);

    useEffect(() => {
        socket.emit('new_user', {
            roomId,
            key: userId,
            roomId,
            position: [initialPos.x, initialPos.y, initialPos.z],
            quaternion: [0, 0, 0, 1],
            avatarType: avatar,
            action: boxmanActions.idle,
        });
        return () => {
            socket.emit('disconnect_user', { key: userId, user: userName, roomId });
        };
    }, []);

    useEffect(() => {
        setControls(props.controls);
        setUserName(props.userName);
        setAvatar(props.avatar);
    }, [props]);

    const moved = (object, action = boxmanActions.idle) => {
        let { x, y, z } = object.position;
        let { _x, _y, _z, _w } = object.quaternion;
        socket.emit('move', {
            key: userId,
            roomId,
            position: [x, y, z],
            quaternion: [_x, _y, _z, _w],
            avatarType: avatar,
            action: action,
        });
    };

    let controls = <CameraControlsWalk avatarType={avatar} moved={moved} setWalking={setWalking} movement={movement} />;

    return (
        <div style={{ height: '100vh' }}>
            {/* gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} */}
            <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} camera={{ far: 4000 }}>
                {/* <Perf position="top-left" /> */}
                <Ocean />
                <Ground length={11} breadth={11} />
                {/* <OrbitControls /> */}
                {controls}
                <Cubes cubesData={cubesData} />
                {/* <Players /> */}
            </Canvas>
        </div>
    );
};

export default World;
