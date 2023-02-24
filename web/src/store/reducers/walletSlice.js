import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: { loggedIn: null },
};

export const walletSlice = createSlice({
    name: 'wallet',
    initialState: initialState,
    reducers: {
        setUser: (state, user) => {
            state.user = user.payload;
        },
    },
});

export const { setUser } = walletSlice.actions;

export const selectUser = (state) => state.wallet.user;

export default walletSlice.reducer;
