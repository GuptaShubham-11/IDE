import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isEligibleToVerify: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        eligibleToVerify: (state) => {
            state.isEligibleToVerify = true;
        },
        signIn: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.isEligibleToVerify = false;
        },
        signOut: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isEligibleToVerify = false;
        },
    }
});

export const { signIn, signOut, eligibleToVerify } = authSlice.actions;
export default authSlice.reducer;