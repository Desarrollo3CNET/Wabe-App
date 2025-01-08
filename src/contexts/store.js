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
    items: [],
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

// Slice para trazos de golpes
const golpesSlice = createSlice({
  name: 'golpes',
  initialState: {
    vehicleStyle: 'Sedán',
    paths: [],
    undonePaths: [],
    isDirty: false,
  },
  reducers: {
    setVehicleStyle: (state, action) => {
      state.vehicleStyle = action.payload;
    },
    addPath: (state, action) => {
      state.paths.push(action.payload);
      state.undonePaths = [];
    },
    undoPath: (state) => {
      if (state.paths.length > 0) {
        const lastPath = state.paths.pop();
        state.undonePaths.unshift(lastPath);
      }
    },
    redoPath: (state) => {
      if (state.undonePaths.length > 0) {
        const lastUndonePath = state.undonePaths.shift();
        state.paths.push(lastUndonePath);
      }
    },
    clearPaths: (state) => {
      state.paths = [];
      state.undonePaths = [];
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
        accesorio.infoVisible = false;
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

// Slice para la revisión de suspensión
const suspensionReviewSlice = createSlice({
  name: 'suspensionReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Amortiguador',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 2,
        nombre: 'Galleta',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 3,
        nombre: 'Resorte',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 4,
        nombre: 'Hule de Tope',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 5,
        nombre: 'Tijereta Sup',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 6,
        nombre: 'Tijereta Inf',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 7,
        nombre: 'Rótula Suspensión Sup',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 8,
        nombre: 'Rótula Suspensión Inf',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
    ],
  },
  reducers: {
    updateSuspensionItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
      }
    },
  },
});

// Slice para la revisión de suspensión trasera
const suspensionBackReviewSlice = createSlice({
  name: 'suspensionBackReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Amortiguador Trasero',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 2,
        nombre: 'Galleta Trasera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 3,
        nombre: 'Resorte Trasero',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 4,
        nombre: 'Hule de Tope Trasero',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 5,
        nombre: 'Tijereta Sup Trasera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 6,
        nombre: 'Tijereta Inf Trasera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 7,
        nombre: 'Rótula Suspensión Sup Trasera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 8,
        nombre: 'Rótula Suspensión Inf Trasera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
    ],
  },
  reducers: {
    updateSuspensionBackItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
      }
    },
  },
});

// Slice para la revisión de frenos
const frenosReviewSlice = createSlice({
  name: 'frenosReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Pastillas',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 2,
        nombre: 'Discos',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 3,
        nombre: 'Pin de Caliper',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 4,
        nombre: 'Caliper',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 5,
        nombre: 'Empaque de Caliper',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 6,
        nombre: 'Mantenimiento Caliper',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 7,
        nombre: 'Tubería',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 8,
        nombre: 'Manguera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 9,
        nombre: 'Fitting',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 10,
        nombre: 'Seguros',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 11,
        nombre: 'Zapatas',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 12,
        nombre: 'Tambor',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 13,
        nombre: 'Resortes de Zapata',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
    ],
  },
  reducers: {
    updateFrenosItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
      }
    },
  },
});

// Slice para la revisión de frenos traseros
const frenosBackReviewSlice = createSlice({
  name: 'frenosBackReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Pastillas',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 2,
        nombre: 'Discos',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 3,
        nombre: 'Pin de Caliper',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 4,
        nombre: 'Caliper',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 5,
        nombre: 'Empaque de Caliper',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 6,
        nombre: 'Mantenimiento Caliper',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 7,
        nombre: 'Tubería',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 8,
        nombre: 'Manguera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 9,
        nombre: 'Fitting',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 10,
        nombre: 'Seguros',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 11,
        nombre: 'Zapatas',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 12,
        nombre: 'Tambor',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 13,
        nombre: 'Resortes de Zapata',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
    ],
  },
  reducers: {
    updateFrenosBackItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
      }
    },
  },
});

const rodamientosReviewSlice = createSlice({
  name: 'rodamientosReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Punta Hom. Int',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 2,
        nombre: 'Punta Hom. Ext',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 3,
        nombre: 'Bota Int',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 4,
        nombre: 'Bota Ext',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 5,
        nombre: 'Cruceta Int.',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 6,
        nombre: 'Gazas Int.',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 7,
        nombre: 'Gazas Ext.',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 8,
        nombre: 'Grasas',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 9,
        nombre: 'Rodamiento',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 10,
        nombre: 'Seguros',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 11,
        nombre: 'Tuerca',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
    ],
  },
  reducers: {
    updateRodamientosItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
      }
    },
  },
});

const rodamientosBackReviewSlice = createSlice({
  name: 'rodamientosBackReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Punta Hom. Int',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 2,
        nombre: 'Punta Hom. Ext',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 3,
        nombre: 'Bota Int',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 4,
        nombre: 'Bota Ext',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 5,
        nombre: 'Cruceta Int.',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 6,
        nombre: 'Gazas Int.',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 7,
        nombre: 'Gazas Ext.',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 8,
        nombre: 'Grasas',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 9,
        nombre: 'Rodamiento',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 10,
        nombre: 'Seguros',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 11,
        nombre: 'Tuerca',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
    ],
  },
  reducers: {
    updateRodamientosBackItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
      }
    },
  },
});

const direccionReviewSlice = createSlice({
  name: 'direccionReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Cremallera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 2,
        nombre: 'Caja de Dirección',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 3,
        nombre: 'Rótulas Ext',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 4,
        nombre: 'Brazo Pitman',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 5,
        nombre: 'Brazo Auxiliar',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 6,
        nombre: 'Bujes Brazo Pitman',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 7,
        nombre: 'Bujes Brazo Auxiliar',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 8,
        nombre: 'Barra Central',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
      {
        id: 9,
        nombre: 'Buje Cremallera',
        estadoDerecha: 'Bueno',
        estadoIzquierda: 'Bueno',
      },
    ],
  },
  reducers: {
    updateDireccionItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (side === 'derecha') item.estadoDerecha = status;
        else if (side === 'izquierda') item.estadoIzquierda = status;
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
export const {
  setVehicleStyle,
  addPath,
  undoPath,
  redoPath,
  clearPaths,
  toggleDirty,
} = golpesSlice.actions;

export const { updateSuspensionItem } = suspensionReviewSlice.actions;

export const { updateSuspensionBackItem } = suspensionBackReviewSlice.actions;

export const { updateFrenosItem } = frenosReviewSlice.actions;

export const { updateFrenosBackItem } = frenosBackReviewSlice.actions;

export const { updateRodamientosItem } = rodamientosReviewSlice.actions;

export const { updateRodamientosBackItem } = rodamientosBackReviewSlice.actions;

export const { updateDireccionItem } = direccionReviewSlice.actions;

// Configuración del store
const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    vehicleDetails: vehicleDetailsSlice.reducer,
    firma: firmaSlice.reducer,
    attachments: attachmentsSlice.reducer,
    accesorios: accesoriosSlice.reducer,
    golpes: golpesSlice.reducer,
    suspensionReview: suspensionReviewSlice.reducer,
    suspensionBackReview: suspensionBackReviewSlice.reducer,
    frenosReview: frenosReviewSlice.reducer,
    frenosBackReview: frenosBackReviewSlice.reducer,
    rodamientosReview: rodamientosReviewSlice.reducer,
    rodamientosBackReview: rodamientosBackReviewSlice.reducer,
    direccionReview: direccionReviewSlice.reducer,
  },
});

export default store;
