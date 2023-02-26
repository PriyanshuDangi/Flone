import create from 'zustand';
import { devtools } from 'zustand/middleware';

let useStore = create((set) => ({
    cubesPos: new Map(),
    updateCubesPos: (cubesPos) =>
        set((state) => ({
            cubesPos: cubesPos,
        })),
}));

// useStore = devtools(useStore);

export default useStore;
