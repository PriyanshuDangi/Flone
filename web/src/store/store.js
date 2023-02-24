import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './reducers/walletSlice.js';

export const store = configureStore({
    reducer: {
        wallet: walletReducer,
    },
});
