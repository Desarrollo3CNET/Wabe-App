import { createSlice } from '@reduxjs/toolkit';

// Define el estado inicial fuera de createSlice
const initialState = {
  isLogged: false,
  user: null,
  token: null,
  loading: false,
  isCreatingBoleta: false,
  isCreatingRevision: false,
};

// Slice para la gestión del estado de la aplicación
const appSlice = createSlice({
  name: 'app',
  initialState, // Usa la constante initialState aquí
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
    setCreatingBoletaTrue: (state) => {
      state.isCreatingBoleta = true; // Reducer para activar la creación de boleta
    },
    setCreatingBoletaFalse: (state) => {
      state.isCreatingBoleta = false; // Reducer para desactivar la creación de boleta
    },
    setCreatingRevisionTrue: (state) => {
      state.isCreatingRevision = true; // Reducer para activar la creación de Revision
    },
    setCreatingRevisionFalse: (state) => {
      state.isCreatingRevision = false; // Reducer para desactivar la creación de Revision
    },
    resetState: () => initialState, // Usa initialState correctamente aquí
  },
});

export const {
  setLoggedIn,
  setLoggedOut,
  setLoading,
  setCreatingBoletaTrue,
  setCreatingBoletaFalse,
  setCreatingRevisionTrue,
  setCreatingRevisionFalse,
  resetState,
} = appSlice.actions;

export default appSlice.reducer;
