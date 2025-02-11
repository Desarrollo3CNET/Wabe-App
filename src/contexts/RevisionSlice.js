import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  articulosMantenimiento: [],
  articulosAgregados: [],
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
      state.articulosAgregados = [];
    },
    activarArticulo: (state, action) => {
      const artCode = action.payload;

      state.articulosMantenimiento = state.articulosMantenimiento.map(
        (categoria) => ({
          ...categoria,
          Articulos: categoria.Articulos.map((articulo) =>
            articulo.ART_CODE === artCode
              ? { ...articulo, ESTADO: true }
              : articulo,
          ),
        }),
      );
    },
    desactivarArticulo: (state, action) => {
      const artCode = action.payload;

      state.articulosMantenimiento = state.articulosMantenimiento.map(
        (categoria) => ({
          ...categoria,
          Articulos: categoria.Articulos.map((articulo) =>
            articulo.ART_CODE === artCode
              ? { ...articulo, ESTADO: false }
              : articulo,
          ),
        }),
      );
    },
    agregarArticulo: (state, action) => {
      const { ART_NOMBRE, ESTADO } = action.payload;

      const nuevoArticulo = {
        ART_CODE: '',
        ART_CREATEDATE: '',
        ART_DESCRIPCION: ART_NOMBRE,
        ART_NOMBRE: ART_NOMBRE,
        ART_UPDATEDATE: '',
        ESTADO: ESTADO,
      };

      state.articulosAgregados.push(nuevoArticulo);
    },
    eliminarArticulo: (state, action) => {
      const ART_NOMBRE = action.payload;

      state.articulosAgregados = state.articulosAgregados.filter(
        (articulo) => articulo.ART_NOMBRE !== ART_NOMBRE,
      );
    },
  },
});

export const {
  setArticulosMantenimiento,
  resetAllStates,
  activarArticulo,
  desactivarArticulo,
  agregarArticulo,
  eliminarArticulo,
} = revisionSlice.actions;

export default revisionSlice.reducer;
