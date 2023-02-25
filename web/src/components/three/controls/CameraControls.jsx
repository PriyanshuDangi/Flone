import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as holdEvent from 'hold-event';
import { avatars } from '../../../assets/avatar';
import * as boxmanActions from '../player/boxmanActions';
import Boxman from '../player/Boxman';
import useCameraControls from './UseCameraControls';
// import useCubePosition from '../Cubes/CubesPosition';
// import useStore from '../../zustand/useStore';

import { boxSize, piece, continentPiece } from '../../../config/world.js';

CameraControls.install({ THREE: THREE });
// let cameraControls;

const KEYCODE = {
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
};

let playerSpeed = 25;

const moveFieldByKey = (key) => {
    switch (key) {
        case 'KeyW':
        case 'ArrowUp':
            return 'forward';
        case 'KeyS':
        case 'ArrowDown':
            return 'backward';
        case 'KeyA':
        case 'ArrowLeft':
            return 'left';
        case 'KeyD':
        case 'ArrowRight':
            return 'right';
        case 'Space':
            return 'jump';
        case 'ShiftLeft':
        case 'ShiftRight':
            return 'shift';
        default:
            return null;
    }
};

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

let currentAction = boxmanActions.idle;
const cubeBox = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
const playerBox = new THREE.Box3();
const playerSphere = new THREE.Sphere();

let _xColumn = new THREE.Vector3();
let _yColumn = new THREE.Vector3();
let _v3A = new THREE.Vector3();
let _v3B = new THREE.Vector3();

let initialState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    // jump: false,
    // shift: false,
};

const CameraControlsWalk = ({ ...props }) => {
    const { camera } = useThree();
    const cameraControls = useCameraControls();
    // const cubesPos = useStore((state) => state.cubesPos);

    // const { movement, setMovement } = props;

    const [movement, setMovement] = useState(initialState);

    useEffect(() => {
        if (props.movement) {
            setMovement(props.movement);
        }
    }, [props.movement]);

    let type = 'Adventurer';
    let avatarData = avatars[type];
    let playerPosition = avatarData.position;
    let scale = avatarData.scale;
    if (props.avatarType) {
        type = props.avatarType;
        avatarData = avatars[type];
        playerPosition = avatarData.position;
        scale = avatarData.scale;
    }
    // let [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(avatarData.position));
    let [playerQuaternion, setPlayerQuaternion] = useState(new THREE.Quaternion());
    const [action, setAction] = useState(boxmanActions.idle);

    const playerRef = useRef();

    let moved = () => {
        props.moved(playerRef.current, currentAction);
    };

    const getKey = (position) => {
        return position.x + '_' + position.y + '_' + position.z;
    };

    const getFloor = (x) => {
        let p = Math.floor(x);
        if (p % 2 == 0) {
            return p - 1;
        } else {
            return p;
        }
    };

    const getCeil = (x) => {
        let p = Math.ceil(x);
        if (p % 2 == 0) {
            return p - 1;
        } else {
            return p;
        }
    };

    const checkCollision = () => {
        playerBox.setFromObject(playerRef.current);
        playerBox.getBoundingSphere(playerSphere);
        let { min, max } = playerBox;
        let x1, y1, z1, x2, y2, z2;
        x1 = getFloor(min.x);
        y1 = getFloor(min.y);
        z1 = getFloor(min.z);

        x2 = getCeil(max.x);
        y2 = getCeil(max.y);
        z2 = getCeil(max.z);

        let maxX = (boxSize * piece * continentPiece) / 2;

        if (x2 > maxX || x1 < -maxX || z2 > maxX || z1 < -maxX) {
            return true;
        }

        for (let x = x1; x <= x2; x += 2) {
            for (let y = y1; y <= y2; y += 2) {
                for (let z = z1; z <= z2; z += 2) {
                    let key = getKey({ x, y, z });
                    // if (cubesPos.has(key)) {
                    //     cubeBox.setFromCenterAndSize(new THREE.Vector3(x, y, z), new THREE.Vector3(2, 2, 2));
                    //     let intersect = playerBox.intersectsBox(cubeBox);
                    //     // let intersect = playerSphere.intersectsBox(cubeBox);
                    //     if (intersect) {
                    //         return true;
                    //     }
                    // }
                }
            }
        }
        return false;
    };

    const movePlayer = (delta) => {
        let { forward, backward, left, right } = movement;
        let front = Number(forward) - Number(backward);
        let side = Number(right) - Number(left);
        frontVector.set(0, 0, Number(movement.forward) - Number(movement.backward));
        sideVector.set(Number(movement.left) - Number(movement.right), 0, 0);
        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(playerSpeed * delta);

        if (front) {
            cameraControls.forward(direction.z, false);
        }
        if (side) {
            // cameraControls.truck(direction.x, 0, false);

            // cameraControls._camera.updateMatrix();
            _xColumn.setFromMatrixColumn(cameraControls._camera.matrix, 0);
            _yColumn.setFromMatrixColumn(cameraControls._camera.matrix, 1);
            _xColumn.multiplyScalar(direction.x);
            _yColumn.multiplyScalar(0);
            const offset = _v3A.copy(_xColumn).add(_yColumn);
            const to = _v3B.copy(cameraControls._targetEnd).add(offset);
            cameraControls.moveTo(to.x, to.y, 0, false);
        }

        if (front || side) {
            let lookAt = cameraControls._target.clone();
            let angleYCameraDirection = Math.atan2(camera.position.x - lookAt.x, camera.position.z - lookAt.z);
            let directionOffset =
                Math.atan2(Number(forward) - Number(backward), Number(right) - Number(left)) + Math.PI / 2;
            let rotateQuarternion = new THREE.Quaternion();
            rotateQuarternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angleYCameraDirection + directionOffset);
            playerRef.current.quaternion.rotateTowards(rotateQuarternion, 0.2);
            playerRef.current.position.copy(cameraControls._target);
            if (checkCollision()) {
                if (front) {
                    cameraControls.forward(-direction.z, false);
                }
                if (side) {
                    cameraControls.truck(-direction.x, 0, false);
                }
                playerRef.current.position.copy(cameraControls._target);
            }
            moved();
        }
    };

    useEffect(() => {
        let { forward, backward, left, right } = movement;
        if (forward || backward || left || right) {
            if (action !== boxmanActions.run) {
                setAction(boxmanActions.run);
                currentAction = boxmanActions.run;
                props.setWalking(true);
                moved();
            }
        } else {
            if (action !== boxmanActions.idle) {
                setAction(boxmanActions.idle);
                currentAction = boxmanActions.idle;
                props.setWalking(false);
                moved();
            }
        }
    }, [movement]);

    useEffect(() => {
        cameraControls.setLookAt(0, 5, 15, 0, playerPosition.y, 0);

        function handleVisibilityChange() {
            if (document.visibilityState === 'hidden') {
                setMovement(initialState);
            }
        }

        const handleTabChange = () => {
            setMovement(initialState);
        };

        window.addEventListener('blur', handleTabChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        const wKey = new holdEvent.KeyboardKeyHold(KEYCODE.W, 16.666);
        const aKey = new holdEvent.KeyboardKeyHold(KEYCODE.A, 16.666);
        const sKey = new holdEvent.KeyboardKeyHold(KEYCODE.S, 16.666);
        const dKey = new holdEvent.KeyboardKeyHold(KEYCODE.D, 16.666);
        const arrowLeftKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_LEFT, 16.666);
        const arrowUpKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_UP, 16.666);
        const arrowRightKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_RIGHT, 16.666);
        const arrowDownKey = new holdEvent.KeyboardKeyHold(KEYCODE.ARROW_DOWN, 16.666);

        const holdStart = (event) => {
            let code = event.originalEvent.code;
            let direction = moveFieldByKey(code);
            setMovement((state) => ({ ...state, [direction]: true }));
        };

        const holdEnd = (event) => {
            let code = event.originalEvent.code;
            let direction = moveFieldByKey(code);
            setMovement((state) => ({ ...state, [direction]: false }));
            moved();
        };

        wKey.addEventListener('holdStart', holdStart);
        wKey.addEventListener('holdEnd', holdEnd);

        arrowUpKey.addEventListener('holdStart', holdStart);
        arrowUpKey.addEventListener('holdEnd', holdEnd);

        sKey.addEventListener('holdStart', holdStart);
        sKey.addEventListener('holdEnd', holdEnd);

        arrowDownKey.addEventListener('holdStart', holdStart);
        arrowDownKey.addEventListener('holdEnd', holdEnd);

        aKey.addEventListener('holdStart', holdStart);
        aKey.addEventListener('holdEnd', holdEnd);

        arrowLeftKey.addEventListener('holdStart', holdStart);
        arrowLeftKey.addEventListener('holdEnd', holdEnd);

        dKey.addEventListener('holdStart', holdStart);
        dKey.addEventListener('holdEnd', holdEnd);

        arrowRightKey.addEventListener('holdStart', holdStart);
        arrowRightKey.addEventListener('holdEnd', holdEnd);

        return () => {
            window.removeEventListener('blur', handleTabChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            wKey.removeEventListener('holdStart', holdStart);
            wKey.removeEventListener('holdEnd', holdEnd);

            arrowUpKey.removeEventListener('holdStart', holdStart);
            arrowUpKey.removeEventListener('holdEnd', holdEnd);

            sKey.removeEventListener('holdStart', holdStart);
            sKey.removeEventListener('holdEnd', holdEnd);

            arrowDownKey.removeEventListener('holdStart', holdStart);
            arrowDownKey.removeEventListener('holdEnd', holdEnd);
            aKey.removeEventListener('holdStart', holdStart);
            aKey.removeEventListener('holdEnd', holdEnd);

            arrowLeftKey.removeEventListener('holdStart', holdStart);
            arrowLeftKey.removeEventListener('holdEnd', holdEnd);

            dKey.removeEventListener('holdStart', holdStart);
            dKey.removeEventListener('holdEnd', holdEnd);

            arrowRightKey.removeEventListener('holdStart', holdStart);
            arrowRightKey.removeEventListener('holdEnd', holdEnd);
        };
    }, []);

    useFrame((_, delta) => {
        if (cameraControls) {
            movePlayer(delta);
            cameraControls.update(delta);
        }
    });

    return <Boxman ref={playerRef} action={action} avatarType={type} />;
};

export default CameraControlsWalk;
