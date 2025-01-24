import { createSlice } from '@reduxjs/toolkit';

// Slice para la gestión del estado de la aplicación
const appSlice = createSlice({
  name: 'app',
  initialState: {},
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLogged = true;
      state.user = {
        EMP_CODE: action.payload.EMP_CODE,
        EMP_NOMBRE: action.payload.EMP_NOMBRE,
        EMPL_NOMBRE: action.payload.EMPL_NOMBRE,
        USU_CODE: action.payload.USU_CODE,
        USU_USERNAME: action.payload.USU_USERNAME,
      };
      state.token = action.payload.TOKEN;
    },
    setLoggedOut: (state) => {
      state.isLogged = false;
      state.user = null;
      state.token = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoggedIn, setLoggedOut, setLoading } = appSlice.actions;

export default appSlice.reducer;
