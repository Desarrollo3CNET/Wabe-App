import { createSlice, configureStore } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    isLogged: false,
    user: null,
    loading: false,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLogged = true;
      state.user = action.payload;
    },
    setLoggedOut: (state) => {
      state.isLogged = false;
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoggedIn, setLoggedOut, setLoading } = appSlice.actions;

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export default store;
