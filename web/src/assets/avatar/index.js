import adventurer from './Faces/face_adventurer.png';
import man from './Faces/face_man.png';
import manAlt from './Faces/face_manAlternative.png';
import orc from './Faces/face_orc.png';
import robot from './Faces/face_robot.png';
import soldier from './Faces/face_soldier.png';
import woman from './Faces/face_woman.png';
import womanAlt from './Faces/face_womanAlternative.png';

import adventurerModel from './boxman/adventurer.glb';
import manModel from './boxman/man.glb';
import manAlternativeModel from './boxman/manAlternative.glb';
import orcModel from './boxman/orc.glb';
import robotModel from './boxman/robot.glb';
import soldierModel from './boxman/soldier.glb';
import womanModel from './boxman/woman.glb';
import womanAlternativeModel from './boxman/womanAlternative.glb';

export const avatars = {
    Adventurer: {
        image: adventurer,
        name: 'Adventurer',
        model: adventurerModel,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 },
    },
    Man: {
        image: man,
        name: 'Man',
        model: manModel,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 },
    },
    ManAlt: {
        image: manAlt,
        name: 'ManAlt',
        model: manAlternativeModel,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 },
    },
    Orc: {
        image: orc,
        name: 'Orc',
        model: orcModel,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 },
    },
    Robot: {
        image: robot,
        name: 'Robot',
        model: robotModel,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 },
    },
    Soldier: {
        image: soldier,
        name: 'Soldier',
        model: soldierModel,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 },
    },
    Woman: {
        image: woman,
        name: 'Woman',
        model: womanModel,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 },
    },
    WomanAlt: {
        image: womanAlt,
        name: 'WomanAlt',
        model: womanAlternativeModel,
        position: { x: 0, y: 0, z: 0 },
        scale: { x: 4, y: 4, z: 4 },
    },
};
