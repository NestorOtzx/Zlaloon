import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Features/Users/UsersSlice';


const store = configureStore({
  reducer: {
    userdata: userReducer,
  },
});

export default store;