import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: '',
    selectedWorkspaceId: ''
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      if (action.payload.token !== undefined) {
        state.token = action.payload.token;
      }
      if (action.payload.workspaceId !== undefined){
        state.selectedWorkspaceId = action.payload.workspaceId; 
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.token = '';
    },
    setWorkspaceId: (state) =>{
      state.selectedWorkspaceId = state.payload.workSpaceId
    }
  },
});

export const { setUser, clearUser,setToken } = authSlice.actions;
export default authSlice.reducer;
