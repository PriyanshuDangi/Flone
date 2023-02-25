import React, { useState } from 'react';
import CameraControls from 'camera-controls';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

CameraControls.install({ THREE: THREE });

const useCameraControls = () => {
    const { camera, gl, scene } = useThree();
    const [cameraControls, _] = useState(new CameraControls(camera, gl.domElement));

    useEffect(() => {
        cameraControls.minDistance = 7;
        cameraControls.maxDistance = 30;
        cameraControls.minPolarAngle = 0;
        cameraControls.maxPolarAngle = Math.PI / 2 - 0.01;
        cameraControls.truckSpeed = 0;
    }, []);

    return cameraControls;
};

export default useCameraControls;
