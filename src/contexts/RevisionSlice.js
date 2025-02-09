import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articulosMantenimiento: [],
};

const revisionSlice = createSlice({
  name: 'revision',
  initialState,
  reducers: {
    setArticulosMantenimiento: (state, action) => {
      state.articulosMantenimiento = action.payload;
    },
    resetAllStates: (state) => {
      state.articulosMantenimiento = [];
    },
    toggleEstadoArticulo: (state, action) => {
      const artCode = action.payload;
      console.log(state.articulosMantenimiento);

      state.articulosMantenimiento = state.articulosMantenimiento.map(
        (categoria) => ({
          ...categoria,
          Articulos: categoria.Articulos.map((articulo) =>
            articulo.ART_CODE === artCode
              ? {
                  ...articulo,
                  ESTADO: articulo.ESTADO === null ? true : !articulo.ESTADO,
                }
              : articulo,
          ),
        }),
      );
    },
  },
});

export const {
  setArticulosMantenimiento,
  resetAllStates,
  toggleEstadoArticulo,
} = revisionSlice.actions;

export default revisionSlice.reducer;
