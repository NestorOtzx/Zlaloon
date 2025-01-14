import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'userdata',
  initialState: { username: '', userid: "", loggedin: false},
  reducers: {
    login: (state, action) => {
      console.log("Payload!!", action.payload);
      const {username, loggedin, userid} = action.payload;
      state.username = username;
      state.loggedin = loggedin;
      state.userid = userid;
    },
    logout: (state) => {
      state.username = "";
      state.userid = "";
      state.loggedin = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;