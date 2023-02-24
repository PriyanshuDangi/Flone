import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { boxSize, piece } from '../../../config/world';
import stoneSilverImg from '../../../assets/tiles/stone_silver.png';

const Ground = (props) => {
    const { length, breadth } = props;
    const { scene } = useThree();

    useEffect(() => {
        const geometry = new THREE.BoxGeometry(length * piece * boxSize, boxSize, breadth * piece * boxSize);
        // geometry.rotateX(Math.PI / 2);
        const loader = new THREE.TextureLoader();

        const texture = loader.load(
            stoneSilverImg,
        );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(piece * boxSize, piece * boxSize);
        texture.anisotropy = 16;
        texture.encoding = THREE.sRGBEncoding;
        // texture.repeat.set(length*piece, length*piece);
        // const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 2, color: '#333' });
        const material = new THREE.MeshBasicMaterial({ map: texture, color: '#999' });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y -= boxSize / 2;
        scene.add(mesh);
    }, []);

    return null;
};

export default Ground;
