import { Canvas } from '@react-three/fiber';
import Ground from '../../components/three/ground/Ground';
import Ocean from '../../components/three/Ocean/Ocean';
import { OrbitControls } from '@react-three/drei';
// import {Perf} from "r3f-perf"
import * as THREE from "three";

const World = () => {

    return (
        <div style={{ height: '100vh' }}>
            {/* gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} */}
            <Canvas gl={{ antialias: true, toneMapping: THREE.NoToneMapping }} camera={{ far: 4000 }}>
                {/* <Perf position="top-left" /> */}
                <Ocean />
                <Ground length={11} breadth={11} />
                <OrbitControls />
            </Canvas>
        </div>
    )
}

export default World;