import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        login: (state, action) => {
            return action.payload;
        },
        logout: () => null,
    },
});

// Action creators are generated for each case reducer function
const accountReducer = accountSlice.reducer;
const accountActions = accountSlice.actions;

export default accountReducer;
export { accountActions };
