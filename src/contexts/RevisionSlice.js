import { createSlice } from '@reduxjs/toolkit';

const revisionSlice = createSlice({
  name: 'revision',
  initialState: {
    // Rodamientos
    rodamientos: [
      {
        id: 1,
        nombre: 'Punta Hom. Int',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 2,
        nombre: 'Punta Hom. Ext',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      { id: 3, nombre: 'Bota Int', estadoDerecha: '', estadoIzquierda: '' },
      { id: 4, nombre: 'Bota Ext', estadoDerecha: '', estadoIzquierda: '' },
      { id: 5, nombre: 'Cruceta Int.', estadoDerecha: '', estadoIzquierda: '' },
      { id: 6, nombre: 'Gazas Int', estadoGeneral: '' },
      { id: 7, nombre: 'Gazas Ext', estadoGeneral: '' },
      { id: 8, nombre: 'Grasas', estadoGeneral: '' },
      { id: 9, nombre: 'Rodamiento', estadoDerecha: '', estadoIzquierda: '' },
      { id: 10, nombre: 'Seguros', estadoGeneral: '' },
      { id: 11, nombre: 'Tuerca', estadoGeneral: '' },
    ],
    rodamientosTraseros: [
      {
        id: 1,
        nombre: 'Punta Hom. Int',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 2,
        nombre: 'Punta Hom. Ext',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      { id: 3, nombre: 'Bota Int', estadoDerecha: '', estadoIzquierda: '' },
      { id: 4, nombre: 'Bota Ext', estadoDerecha: '', estadoIzquierda: '' },
      { id: 5, nombre: 'Cruceta Int.', estadoDerecha: '', estadoIzquierda: '' },
      { id: 6, nombre: 'Gazas Int', estadoGeneral: '' },
      { id: 7, nombre: 'Gazas Ext', estadoGeneral: '' },
      { id: 8, nombre: 'Grasas', estadoGeneral: '' },
      { id: 9, nombre: 'Rodamiento', estadoDerecha: '', estadoIzquierda: '' },
      { id: 10, nombre: 'Seguros', estadoGeneral: '' },
      { id: 11, nombre: 'Tuerca', estadoGeneral: '' },
    ],
    // Dirección
    direccion: [
      { id: 1, nombre: 'Cremallera', estadoGeneral: '' },
      { id: 2, nombre: 'Caja de Dirección', estadoGeneral: '' },
      { id: 3, nombre: 'Rótulas Ext', estadoDerecha: '', estadoIzquierda: '' },
      { id: 4, nombre: 'Brazo Pitman', estadoGeneral: '' },
      { id: 5, nombre: 'Brazo Auxiliar', estadoGeneral: '' },
      {
        id: 6,
        nombre: 'Bujes Brazo Pitman',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 7,
        nombre: 'Bujes Brazo Auxiliar',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      { id: 8, nombre: 'Barra Central', estadoGeneral: '' },
      { id: 9, nombre: 'Buje Cremallera', estadoGeneral: '' },
    ],
    // Extras
    extras: [
      {
        id: 1,
        nombre: 'Cambio Líquido Frenos',
        section: 'Servicios',
        estado: '',
      },
      { id: 2, nombre: 'Cambio Aceite', section: 'Servicios', estado: '' },
      { id: 3, nombre: 'Dir Hidráulica', section: 'Servicios', estado: '' },
      { id: 4, nombre: 'Escobillas', section: 'Servicios', estado: '' },
      {
        id: 5,
        nombre: 'Luz Baja Derecha',
        section: 'Acondicionamiento Exterior',
        estado: '',
      },
      {
        id: 6,
        nombre: 'Luz Alta Izquierda',
        section: 'Acondicionamiento Exterior',
        estado: '',
      },
      {
        id: 7,
        nombre: 'Direccional del Derecho',
        section: 'Acondicionamiento Exterior',
        estado: '',
      },
      {
        id: 8,
        nombre: 'Direccional del Izquierdo',
        section: 'Acondicionamiento Exterior',
        estado: '',
      },
    ],
    // Suspensión
    suspensionDelantera: [
      { id: 1, nombre: 'Amortiguador', estadoDerecha: '', estadoIzquierda: '' },
      { id: 2, nombre: 'Galleta', estadoDerecha: '', estadoIzquierda: '' },
      { id: 3, nombre: 'Resorte', estadoGeneral: '' },
      { id: 4, nombre: 'Hule de Tope', estadoDerecha: '', estadoIzquierda: '' },
      { id: 5, nombre: 'Tijereta Sup', estadoDerecha: '', estadoIzquierda: '' },
      { id: 6, nombre: 'Tijereta Inf', estadoDerecha: '', estadoIzquierda: '' },
      {
        id: 7,
        nombre: 'Rótula Suspensión Sup',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
    ],
    suspensionTrasera: [
      {
        id: 1,
        nombre: 'Amortiguador Trasero',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 2,
        nombre: 'Galleta Trasera',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      { id: 3, nombre: 'Resorte Trasero', estadoGeneral: '' },
      { id: 4, nombre: 'Hule de Tope Trasero', estadoGeneral: '' },
    ],
    // Frenos
    frenosDelanteros: [
      { id: 1, nombre: 'Pastillas', estadoGeneral: '' },
      { id: 2, nombre: 'Discos', estadoGeneral: '' },
      {
        id: 3,
        nombre: 'Pin de Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      { id: 4, nombre: 'Caliper', estadoDerecha: '', estadoIzquierda: '' },
    ],
    frenosTraseros: [
      {
        id: 3,
        nombre: 'Pin de Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      { id: 4, nombre: 'Caliper', estadoDerecha: '', estadoIzquierda: '' },
      { id: 1, nombre: 'Pastillas Traseras', estadoGeneral: '' },
      { id: 2, nombre: 'Discos Traseros', estadoGeneral: '' },
      { id: 3, nombre: 'Tambor Trasero', estadoGeneral: '' },
    ],
    // Artículos genéricos
    articulosGenericos: {
      buenos: [],
      malos: [],
    },
    articulosBoleta: [],
  },
  reducers: {
    // Métodos para rodamientos
    updateRodamientosItem: (state, action) => {
      const { id, side, status, type } = action.payload;
      const items =
        type === 'traseros' ? state.rodamientosTraseros : state.rodamientos;
      const item = items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
        else if (side === 'general') item.estadoGeneral = status;
      }
    },
    // Métodos para dirección
    updateDireccionItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.direccion.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
        else if (side === 'general') item.estadoGeneral = status;
      }
    },
    // Métodos para suspensión
    updateSuspensionItem: (state, action) => {
      const { id, side, status, type } = action.payload;
      const items =
        type === 'delantera'
          ? state.suspensionDelantera
          : state.suspensionTrasera;
      const item = items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
        else if (side === 'general') item.estadoGeneral = status;
      }
    },
    // Métodos para frenos
    updateFrenosItem: (state, action) => {
      const { id, side, status, type } = action.payload;
      const items =
        type === 'delanteros' ? state.frenosDelanteros : state.frenosTraseros;
      const item = items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
        else if (side === 'general') item.estadoGeneral = status;
      }
    },
    // Métodos para extras
    updateExtrasItem: (state, action) => {
      const { id, status } = action.payload;
      const item = state.extras.find((item) => item.id === id);
      if (item) {
        item.estado = status;
      }
    },
    // Métodos para artículos genéricos
    agregarArticulo: (state, action) => {
      const { nombre, estado } = action.payload;
      if (estado === '') {
        state.articulosGenericos.buenos.push(nombre);
      } else if (estado === 'Malo') {
        state.articulosGenericos.malos.push(nombre);
      }
    },
    eliminarArticulo: (state, action) => {
      const { nombre, estado } = action.payload;
      if (estado === '') {
        state.articulosGenericos.buenos = state.articulosGenericos.s.filter(
          (articulo) => articulo !== nombre,
        );
      } else if (estado === 'Malo') {
        state.articulosGenericos.malos = state.articulosGenericos.malos.filter(
          (articulo) => articulo !== nombre,
        );
      }
    },
    agregarArticuloBoleta: (state, action) => {
      const { nombre } = action.payload;
      if (nombre && !state.articulosBoleta.includes(nombre)) {
        state.articulosBoleta.push(nombre);
      }
    },
    resetAllStates: (state) => {
      // Resetear rodamientos delanteros
      state.rodamientos.forEach((item) => {
        if (item.estadoDerecha !== undefined) item.estadoDerecha = '';
        if (item.estadoIzquierda !== undefined) item.estadoIzquierda = '';
        if (item.estadoGeneral !== undefined) item.estadoGeneral = '';
      });

      // Resetear rodamientos traseros
      state.rodamientosTraseros.forEach((item) => {
        if (item.estadoDerecha !== undefined) item.estadoDerecha = '';
        if (item.estadoIzquierda !== undefined) item.estadoIzquierda = '';
        if (item.estadoGeneral !== undefined) item.estadoGeneral = '';
      });

      // Resetear dirección
      state.direccion.forEach((item) => {
        if (item.estadoDerecha !== undefined) item.estadoDerecha = '';
        if (item.estadoIzquierda !== undefined) item.estadoIzquierda = '';
        if (item.estadoGeneral !== undefined) item.estadoGeneral = '';
      });

      // Resetear suspensión delantera
      state.suspensionDelantera.forEach((item) => {
        if (item.estadoDerecha !== undefined) item.estadoDerecha = '';
        if (item.estadoIzquierda !== undefined) item.estadoIzquierda = '';
        if (item.estadoGeneral !== undefined) item.estadoGeneral = '';
      });

      // Resetear suspensión trasera
      state.suspensionTrasera.forEach((item) => {
        if (item.estadoDerecha !== undefined) item.estadoDerecha = '';
        if (item.estadoIzquierda !== undefined) item.estadoIzquierda = '';
        if (item.estadoGeneral !== undefined) item.estadoGeneral = '';
      });

      // Resetear frenos delanteros
      state.frenosDelanteros.forEach((item) => {
        if (item.estadoDerecha !== undefined) item.estadoDerecha = '';
        if (item.estadoIzquierda !== undefined) item.estadoIzquierda = '';
        if (item.estadoGeneral !== undefined) item.estadoGeneral = '';
      });

      // Resetear frenos traseros
      state.frenosTraseros.forEach((item) => {
        if (item.estadoDerecha !== undefined) item.estadoDerecha = '';
        if (item.estadoIzquierda !== undefined) item.estadoIzquierda = '';
        if (item.estadoGeneral !== undefined) item.estadoGeneral = '';
      });

      // Resetear extras
      state.extras.forEach((item) => {
        item.estado = '';
      });

      // Resetear artículos genéricos
      state.articulosGenericos.buenos = [];
      state.articulosGenericos.malos = [];

      // Resetear artículos de boleta
      state.articulosBoleta = [];
    },
  },
});

export const {
  updateRodamientosItem,
  updateDireccionItem,
  updateSuspensionItem,
  updateFrenosItem,
  updateExtrasItem,
  agregarArticulo,
  eliminarArticulo,
  agregarArticuloBoleta,
  resetAllStates,
} = revisionSlice.actions;

export default revisionSlice.reducer;
