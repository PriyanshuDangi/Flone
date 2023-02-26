import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './reducers/walletSlice.js';
import cubesNFTSlice from './reducers/cubesNFTSlice';

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
        cubesNFT: cubesNFTSlice
    },
});
