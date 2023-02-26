import { useEffect, useState } from 'react';

const useCubePosition = () => {
    const [cubeMap, setMap] = useState(new Map());

    const updateMap = (map) => {
        setMap(map);
    };

    // useEffect(() => {
    //     console.log(cubeMap);
    // }, [cubeMap]);

    return [cubeMap, updateMap];
};

export default useCubePosition;
