import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getNFTs } from '../../utils/wallet';

export const cubesNFTStateType = {
    loading: 'loading',
    idle: 'idle',
    error: 'error',
};

const initialState = {
    cubesNFT: [],
    state: cubesNFTStateType.loading,
    error: null,
};

export const setCubesNFTAsync = createAsyncThunk('cubesNFT/fetch', async () => {
    let cubesNFT = await getNFTs();
    cubesNFT = cubesNFT.reverse();

    return cubesNFT.map((cube, index) => {
        return {
            // token_id: cube.id,
            token_id: index,
            land_ipfs: cube.ipfsHash,
        };
    });
});

export const cubesNFTSlice = createSlice({
    name: 'cubesNFT',
    initialState,
    reducers: {
        setCubesNFT: (state, action) => {
            state.state = cubesNFTStateType.idle;
            state.cubesNFT = action.payload;
        },
        setCubesError: (state, action) => {
            state.state = cubesNFTStateType.error;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setCubesNFTAsync.pending, (state) => {
                state.state = cubesNFTStateType.loading;
            })
            .addCase(setCubesNFTAsync.fulfilled, (state, action) => {
                state.state = cubesNFTStateType.idle;
                state.cubesNFT = action.payload;
            })
            .addCase(setCubesNFTAsync.rejected, (state, action) => {
                state.state = cubesNFTStateType.error;
                state.error = action.payload;
            });
    },
});

export const { setCubesNFT } = cubesNFTSlice.actions;

export const selectCubesNFT = (state) => state.cubesNFT.cubesNFT;
export const selectCubesNFTState = (state) => state.cubesNFT.state;
export const selectCubesNFTError = (state) => state.cubesNFT.error;

export default cubesNFTSlice.reducer;
