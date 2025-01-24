import { createSlice } from '@reduxjs/toolkit';

const boletaSlice = createSlice({
  name: 'boleta',
  initialState: {
    vehicleDetails: {
      placa: '',
      modelo: '',
      estilo: '',
      anio: '',
      fechaIngreso: '',
      horaIngreso: '',
      combustible: '',
      kilometraje: '',
      telefono: '',
    },
    firma: {
      observaciones: '',
      nombre: '',
      firma: null,
    },
    attachments: {
      items: [],
    },
    golpes: {
      vehicleStyle: 'Sedán',
      paths: [],
      undonePaths: [],
      isDirty: false,
      esquema: '',
    },
    accesorios: [],
  },
  reducers: {
    updateVehicleDetail: (state, action) => {
      const { key, value } = action.payload;
      state.vehicleDetails[key] = value;
    },
    setObservaciones: (state, action) => {
      state.firma.observaciones = action.payload;
    },
    setNombre: (state, action) => {
      state.firma.nombre = action.payload;
    },
    setFirma: (state, action) => {
      state.firma.firma = action.payload;
    },
    addAttachment: (state, action) => {
      state.attachments.items.push(action.payload);
    },
    setAttachments(state, action) {
      state.attachments.items = action.payload.items;
    },
    toggleSelectAttachment: (state, action) => {
      const id = action.payload;
      const attachment = state.attachments.items.find((item) => item.id === id);
      if (attachment) {
        attachment.selected = !attachment.selected;
      }
    },
    deleteSelectedAttachments: (state) => {
      state.attachments.items = state.attachments.items.filter(
        (item) => !item.selected,
      );
    },
    setVehicleStyle: (state, action) => {
      state.golpes.vehicleStyle = action.payload;
    },
    setEsquema: (state, action) => {
      state.golpes.esquema = action.payload;
    },
    addPath: (state, action) => {
      state.golpes.paths.push(action.payload);
      state.golpes.undonePaths = [];
    },
    undoPath: (state) => {
      if (state.golpes.paths.length > 0) {
        const lastPath = state.golpes.paths.pop();
        state.golpes.undonePaths.unshift(lastPath);
      }
    },
    redoPath: (state) => {
      if (state.golpes.undonePaths.length > 0) {
        const lastUndonePath = state.golpes.undonePaths.shift();
        state.golpes.paths.push(lastUndonePath);
      }
    },
    clearPaths: (state) => {
      state.golpes.paths = [];
      state.golpes.undonePaths = [];
    },
    toggleDirty: (state) => {
      state.golpes.isDirty = !state.golpes.isDirty;
    },
    addAccesorio: (state, action) => {
      state.accesorios.push(action.payload);
    },
    updateAccesorio: (state, action) => {
      const { id, updates } = action.payload;
      const accesorio = state.accesorios.find((item) => item.id === id);
      if (accesorio) {
        Object.assign(accesorio, updates);
      }
    },
    removeAccesorio: (state, action) => {
      state.accesorios = state.accesorios.filter(
        (item) => item.id !== action.payload,
      );
    },
  },
});

export const {
  updateVehicleDetail,
  setObservaciones,
  setNombre,
  setFirma,
  addAttachment,
  toggleSelectAttachment,
  deleteSelectedAttachments,
  setVehicleStyle,
  addPath,
  setAttachments,
  undoPath,
  redoPath,
  clearPaths,
  toggleDirty,
  addAccesorio,
  updateAccesorio,
  removeAccesorio,
  setEsquema,
} = boletaSlice.actions;

export default boletaSlice.reducer;
