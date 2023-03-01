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
import { useCallback, useEffect, useState } from 'react';
import Cubes from '../../components/three/Cubes/Cubes';
import { useSelector } from 'react-redux';
import { selectCubesNFT } from '../../store/reducers/cubesNFTSlice';

import Chat from '../../components/chat/connectChat';

import styleClasses from './styles.module.css';

import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import VolumeSlider from '../../components/VolumeSlider/VolumeSlider';

import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import TouchJoystick from '../../components/joystick/TouchJoystick';

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
    const [showInfo, setShowInfo] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const [userId, setUserId] = useState(nanoid());
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0, z: 0 });
    const [debugMode, setDebugMode] = useState(false);
    const [userName, setUserName] = useState(props.userName);
    const [avatar, setAvatar] = useState(props.avatar);
    const [roomId, setRoomId] = useState(props.roomId);
    const [bgVolume, setBgVolume] = useState(25);
    const [footVolume, setFootVolume] = useState(50);
    const [walking, setWalking] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [movement, setMovement] = useState(initialState);
    const [touchDevice, setTouchDevice] = useState(false);
    const handleFullScreen = useFullScreenHandle();

    useEffect(() => {
        if ('ontouchstart' in window) {
            setTouchDevice(true);
            console.log('touch device detected');
        } else {
            setShowChat(true); // show chat from the start on pc
        }
        console.log('socket');
        socket.emit('new_user', {
            roomId,
            key: userId,
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
        if (showChat || showMenu || showVolumeSlider) setShowSidebar(true);
        else setShowSidebar(false);
    }, [showChat, showMenu, showVolumeSlider]);

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
    // let controls = <MeshWalk />;
    // let controls = <ThirdPersonControls />;

    const reportChange = useCallback(
        (state, handle) => {
            if (handle === handleFullScreen) {
                if (state) setFullscreen(true);
                else setFullscreen(false);
            }
        },
        [handleFullScreen],
    );

    return (
        <>
            <FullScreen handle={handleFullScreen} onChange={reportChange}>
                <div style={{ height: '100vh' }}>
                    {/* gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} */}
                    <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} camera={{ far: 4000 }}>
                        {/* <Perf position="top-left" /> */}
                        <Ocean />
                        <Ground length={11} breadth={11} />
                        {/* <OrbitControls /> */}
                        {controls}
                        <Cubes cubesData={cubesData} />
                        <Players />
                    </Canvas>

                    <div className={styleClasses.sidebar}>
                        <div className={styleClasses.sidebar__header}>
                            <div className={styleClasses.icon}>
                                {!showVolumeSlider ? (
                                    <VolumeUpIcon
                                        onClick={() => {
                                            setShowVolumeSlider(true);
                                            setShowChat(false);
                                            setShowMenu(false);
                                        }}
                                    />
                                ) : (
                                    <CloseIcon onClick={() => setShowVolumeSlider(false)} />
                                )}
                            </div>
                            <div className={styleClasses.icon}>
                                {!showChat ? (
                                    <ChatIcon
                                        onClick={() => {
                                            setShowChat(true);
                                            setShowVolumeSlider(false);
                                            setShowMenu(false);
                                        }}
                                    />
                                ) : (
                                    <CloseIcon onClick={() => setShowChat(false)} />
                                )}
                            </div>
                            <div className={styleClasses.icon}>
                                {!fullscreen ? (
                                    <FullscreenIcon onClick={handleFullScreen.enter} />
                                ) : (
                                    <FullscreenExitIcon onClick={handleFullScreen.exit} />
                                )}
                            </div>
                        </div>
                        <div className={`${styleClasses.sidebar__body} ${!showSidebar ? styleClasses.none : ''}`}>
                            {showVolumeSlider && (
                                <VolumeSlider
                                    bgVolume={bgVolume}
                                    setBgVolume={setBgVolume}
                                    footVolume={footVolume}
                                    setFootVolume={setFootVolume}
                                />
                            )}
                            <Chat userName={userName} roomId={roomId} userId={userId} show={showChat} />
                        </div>
                    </div>
                    <div className={`${styleClasses.joystickContainer} ${!touchDevice ? 'd-none' : ''}`}>
                        <TouchJoystick setMovement={setMovement} />
                    </div>
                </div>
            </FullScreen>
        </>
    );
};

export default World;
