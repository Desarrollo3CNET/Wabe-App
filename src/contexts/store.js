import { createSlice, configureStore } from '@reduxjs/toolkit';

// Slice para la gestión del estado de la aplicación
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

// Slice para los detalles del vehículo
const vehicleDetailsSlice = createSlice({
  name: 'vehicleDetails',
  initialState: {
    placa: '',
    modelo: '',
    estilo: '',
    anio: '',
    fechaIngreso: '',
    horaIngreso: '',
    combustible: '',
  },
  reducers: {
    updateVehicleDetail: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
  },
});

// Slice para la firma
const firmaSlice = createSlice({
  name: 'firma',
  initialState: {
    observaciones: '',
    nombre: '',
    firma: null,
  },
  reducers: {
    setObservaciones: (state, action) => {
      state.observaciones = action.payload;
    },
    setNombre: (state, action) => {
      state.nombre = action.payload;
    },
    setFirma: (state, action) => {
      state.firma = action.payload;
    },
  },
});

// Slice para fotos y videos
const attachmentsSlice = createSlice({
  name: 'attachments',
  initialState: {
    items: [], // Lista de fotos y videos
  },
  reducers: {
    addAttachment: (state, action) => {
      state.items.push(action.payload);
    },
    toggleSelectAttachment: (state, action) => {
      const id = action.payload;
      const attachment = state.items.find((item) => item.id === id);
      if (attachment) {
        attachment.selected = !attachment.selected;
      }
    },
    deleteSelectedAttachments: (state) => {
      state.items = state.items.filter((item) => !item.selected);
    },
  },
});

const golpesSlice = createSlice({
  name: 'golpes',
  initialState: {
    vehicleStyle: 'Sedán', // Estilo seleccionado del vehículo
    paths: [], // Trazos dibujados
    isDirty: false, // Estado del vehículo (sucio o no)
  },
  reducers: {
    setVehicleStyle: (state, action) => {
      state.vehicleStyle = action.payload;
    },
    addPath: (state, action) => {
      state.paths.push(action.payload);
    },
    undoPath: (state) => {
      state.paths.pop();
    },
    clearPaths: (state) => {
      state.paths = [];
    },
    toggleDirty: (state) => {
      state.isDirty = !state.isDirty;
    },
  },
});

// Slice para accesorios dinámicos
const accesoriosSlice = createSlice({
  name: 'accesorios',
  initialState: [
    {
      id: 1,
      nombre: 'Alarma',
      habilitado: false,
      infoVisible: false,
      estado: 'Regular',
    },
    {
      id: 2,
      nombre: 'Gata',
      habilitado: false,
      infoVisible: false,
      estado: 'Regular',
    },
    {
      id: 3,
      nombre: 'Llave de ranas',
      habilitado: true,
      infoVisible: true,
      estado: 'Bueno',
    },
    {
      id: 4,
      nombre: 'Estuche emergencia',
      habilitado: false,
      infoVisible: false,
      estado: 'Malo',
    },
    {
      id: 5,
      nombre: 'Repuesto',
      habilitado: false,
      infoVisible: false,
      estado: 'Regular',
    },
    {
      id: 6,
      nombre: 'Cierre central',
      habilitado: true,
      infoVisible: false,
      estado: 'Regular',
    },
  ],
  reducers: {
    addAccesorio: (state, action) => {
      const {
        id,
        nombre,
        habilitado = false,
        infoVisible = false,
        estado = 'Regular',
      } = action.payload;
      state.push({ id, nombre, habilitado, infoVisible, estado });
    },
    updateAccesorio: (state, action) => {
      const { id, updates } = action.payload;
      const accesorio = state.find((item) => item.id === id);
      if (accesorio) {
        Object.assign(accesorio, updates);
      }
    },
    removeAccesorio: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
    toggleAccesorio: (state, action) => {
      const accesorio = state.find((item) => item.id === action.payload);
      if (accesorio) {
        accesorio.habilitado = !accesorio.habilitado;
        accesorio.infoVisible = false; // Siempre oculta infoVisible
      }
    },
    toggleInfo: (state, action) => {
      const accesorio = state.find((item) => item.id === action.payload);
      if (accesorio) {
        accesorio.infoVisible = !accesorio.infoVisible;
      }
    },
  },
});

// Exportar acciones de cada slice
export const { setLoggedIn, setLoggedOut, setLoading } = appSlice.actions;
export const { updateVehicleDetail } = vehicleDetailsSlice.actions;
export const { setObservaciones, setNombre, setFirma } = firmaSlice.actions;
export const {
  addAttachment,
  toggleSelectAttachment,
  deleteSelectedAttachments,
} = attachmentsSlice.actions;
export const {
  addAccesorio,
  updateAccesorio,
  removeAccesorio,
  toggleAccesorio,
  toggleInfo,
} = accesoriosSlice.actions;

export const { setVehicleStyle, addPath, undoPath, clearPaths, toggleDirty } =
  golpesSlice.actions;
// Configuración del store
const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    vehicleDetails: vehicleDetailsSlice.reducer,
    firma: firmaSlice.reducer,
    attachments: attachmentsSlice.reducer,
    accesorios: accesoriosSlice.reducer,
    golpes: golpesSlice.reducer, // Agregar el slice de accesorios al store
  },
});

export default store;
