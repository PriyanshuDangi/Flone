import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import axios from 'axios';
import { boxSize, height, maxVoxelCount, piece } from '../../../config/world';
import { useThree } from '@react-three/fiber';
import { tokenToCoordinates } from '../../../utils/coordinate/coordinate';
import { createMesh } from '../../../utils/builder/mesh';
import { tiles } from '../../../utils/builder/tiles';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { useFrame } from '@react-three/fiber';
import useStore from '../../../zustand/useStore';
import { BACKEND_URL, PINATA_GATEWAY_URL } from '../../../config/app';
import { useLocation } from 'react-router-dom';

const { object, meshes } = createMesh(11 * 100 * 5);
let cubesCount = tiles.map(() => 0);
// const stats = new Stats();
let maxImageCount = 3;

const useQuery = () => {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
};

const Cubes = (props) => {
    const cubesData = props.cubesData;
    const { scene } = useThree();
    const updateCubesPos = useStore((state) => state.updateCubesPos);
    const query = useQuery();

    useEffect(() => {
        const ambientLight = new THREE.AmbientLight(0x606060);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        scene.add(directionalLight);
        scene.add(object);
    }, []);

    const getKey = (position) => {
        return position.x + '_' + position.y + '_' + position.z;
    };

    const isValidPosition = (position) => {
        let { x, y, z } = position;
        if (x > -1 * piece && x < piece) {
            if (z > -1 * piece && z < piece) {
                if (y >= 0 && y <= piece) {
                    return true;
                }
            }
        }
        return false;
    };

    useEffect(() => {
        const cubePosMap = new Map();

        // const temp = new THREE.Object3D();
        const imageGroup = new THREE.Group();
        const func = async () => {
            const matrix = new THREE.Matrix4();
            let colorIndex = -1;
            let data = cubesData.map(async (cubeData, idx) => {
                // for (let i = 0; i < cubesData.length; i++) {
                // let cubeData = cubesData[i];
                try {
                    let count = [150, 150, 150, 150, 150, 150];

                    let { land_ipfs, token_id } = cubeData;
                    let origin = tokenToCoordinates(parseInt(token_id));

                    if (land_ipfs) {
                        let res = {};
                        if(query.get('fetch') === 'backend'){
                            res = await axios({
                                url: `${process.env.REACT_APP_BACKEND_URL}/storage/lands/${token_id}/ipfs.json`
                            }); 
                        }else {
                           res = await axios({
                            url: process.env.REACT_APP_PINATA_GATEWAY_URL + land_ipfs,
                        }); 
                        }
                        const cubes = res.data.cubes;
                        let images = res.data.images;
                        if (cubes) {
                            for (let j = 0; j < cubes.length; j++) {
                                for (let k = 0; k < cubes[j].length; k++) {
                                    const cube = cubes[j][k];
                                    const { position, color } = cube;
                                    if (
                                        position &&
                                        Number.isInteger(position.x) &&
                                        Number.isInteger(position.y) &&
                                        Number.isInteger(position.z) &&
                                        isValidPosition(position)
                                    ) {
                                        let x = (position.x * boxSize) / 2 + origin.x * piece * boxSize;
                                        let y = (position.y * boxSize) / 2;
                                        let z = (position.z * boxSize) / 2 + origin.y * piece * boxSize;
                                        matrix.setPosition(x, y, z);
                                        meshes[j].setMatrixAt(cubesCount[j], matrix);
                                        if (tiles[j].type === 'color' && color) {
                                            meshes[j].setColorAt(
                                                cubesCount[j],
                                                new THREE.Color(color).convertSRGBToLinear(),
                                            );
                                            colorIndex = j;
                                        }
                                        // if (y < 3) {
                                        cubePosMap.set(getKey({ x, y, z }), true);
                                        // }
                                        cubesCount[j]++;
                                    }
                                }
                            }

                            meshes.forEach((mesh) => {
                                mesh.instanceMatrix.needsUpdate = true;
                            });
                            if (colorIndex !== -1) meshes[0].instanceColor.needsUpdate = true;
                            updateCubesPos(cubePosMap);
                        }
                        if (images) {
                            images = images.slice(0, maxImageCount);
                            for (let j = 0; j < images.length; j++) {
                                let { image, url, position, quaternion, size } = images[j];
                                if (image.substring(0, 7) === 'ipfs://') image = process.env.REACT_APP_PINATA_GATEWAY_URL + image.slice(7);
                                if (!image || !url || !position || !quaternion || !size) {
                                    continue;
                                }
                                let geometry = new THREE.PlaneGeometry(
                                    (size.width * boxSize) / 2,
                                    (size.height * boxSize) / 2,
                                );
                                let load = new THREE.TextureLoader().load(image);
                                load.encoding = THREE.sRGBEncoding;
                                let material = new THREE.MeshBasicMaterial({
                                    map: load,
                                    // transparent: true,
                                    color: 'white',
                                });
                                let mesh = new THREE.Mesh(geometry, material);
                                mesh.position.set(
                                    (position.x * boxSize) / 2 + origin.x * piece * boxSize,
                                    (position.y * boxSize) / 2,
                                    (position.z * boxSize) / 2 + origin.y * piece * boxSize,
                                );
                                mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
                                mesh.userData.url = url;
                                imageGroup.add(mesh);
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            });
            // }
            await Promise.all(data);
            updateCubesPos(cubePosMap);
            scene.add(imageGroup);
        };
        if (cubesData && cubesData.length > 0) func();
        console.log("cubes data changed")
    }, [cubesData]);

    // useFrame(() => {
    //     stats.update();
    // });

    return null;
};

export default Cubes;
