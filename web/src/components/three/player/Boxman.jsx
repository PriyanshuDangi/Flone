import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

import { avatars } from '../../../assets/avatar';
import { forwardRef } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import { useGraph } from '@react-three/fiber';

import * as boxmanActions from './boxmanActions';

const playerConfig = {
    fadeInDuration: 0.2,
    fadeOutDuration: 0.2,
    runSpeed: 5,
    sprintSpeed: 15,
};

const Boxman = forwardRef((props, ref) => {
    let {
        action = boxmanActions.idle,
        avatarType = 'Adventurer',
        position = [0, 0, 0],
        quaternion = [0, 0, 0, 1],
        scale = [6, 6, 6],
    } = props;

    const { scene, materials, animations } = useGLTF(avatars[avatarType].model);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);
    const { actions } = useAnimations(animations, ref);

    const [prevAction, setPrevAction] = useState(boxmanActions.idle);

    useEffect(() => {
        // console.log(action);
        const curr = actions[action];
        if (curr) {
            const prev = actions[prevAction];
            prev.fadeOut(playerConfig.fadeOutDuration);
            curr.reset().fadeIn(playerConfig.fadeInDuration).play();

            setPrevAction(action);
        }
    }, [props.action, action]);

    return (
        <group ref={ref} position={position} quaternion={quaternion} scale={scale} dispose={null}>
            <Suspense fallback={null}>
                <group scale={[0.38, 0.38, 0.38]}>
                    <primitive object={nodes.root} />
                    <skinnedMesh
                        geometry={nodes.game_man.geometry}
                        material={materials.Boxman}
                        skeleton={nodes.game_man.skeleton}
                    />
                </group>
            </Suspense>
        </group>
    );
});

Object.values(avatars).map((avatar) => {
    useGLTF.preload(avatar.model);
});

export default Boxman;
