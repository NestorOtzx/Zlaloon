import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userdata',
  initialState: { username: '', loggedin: false},
  reducers: {
    login: (state, action) => {
      console.log("Payload!!", action.payload);
      const {username, loggedin} = action.payload;
      state.username = username;
      state.loggedin = loggedin;
    },
    logout: (state) => {
      state.username = "";
      state.loggedin = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;