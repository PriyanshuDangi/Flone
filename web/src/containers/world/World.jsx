import { Canvas } from '@react-three/fiber';
import Ocean from '../../components/three/Ocean/Ocean';

const World = () => {

    return (
        <div style={{ height: '100vh' }}>
            <Canvas gl={{ alpha: false }} sRGB camera={{ far: 4000 }}>
                <Ocean />
            </Canvas>
        </div>
    )
}

export default World;