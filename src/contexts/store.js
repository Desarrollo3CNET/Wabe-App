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

// Slice para las citas
const citasSlice = createSlice({
  name: 'citas',
  initialState: [
    {
      fecha: '2024-09-10',
      citas: [
        {
          nombre: 'Juan Pérez',
          estado: 'Pendiente',
          hora: '09 AM - 10 AM',
          info: 'Cambio de aceite y revisión general.',
          numero: '12345',
          sucursal: 'Sucursal A',
        },
        {
          nombre: 'María López',
          estado: 'En revisión',
          hora: '11 AM - 12 PM',
          info: 'Inspección de frenos y alineación.',
          numero: '67890',
          sucursal: 'Sucursal B',
        },
      ],
    },
    {
      fecha: '2024-09-11',
      citas: [
        {
          nombre: 'Carlos Martínez',
          estado: 'Entregado',
          hora: '8 AM - 9 AM',
          info: 'Reparación de motor.',
          numero: '11111',
          sucursal: 'Sucursal A',
        },
        {
          nombre: 'Ana Gómez',
          estado: 'Programada',
          hora: '11 AM - 12 PM',
          info: 'Cambio de llantas.',
          numero: '22222',
          sucursal: 'Sucursal C',
        },
      ],
    },
  ],
  reducers: {
    // Reducer para agregar una nueva cita
    addCita: (state, action) => {
      const { fecha, nuevaCita } = action.payload;
      const fechaIndex = state.findIndex((c) => c.fecha === fecha);
      if (fechaIndex !== -1) {
        // Si la fecha ya existe, agrega la cita a esa fecha
        state[fechaIndex].citas.push(nuevaCita);
      } else {
        // Si la fecha no existe, crea una nueva entrada con la cita
        state.push({ fecha, citas: [nuevaCita] });
      }
    },
    // Reducer para eliminar una cita por número
    removeCita: (state, action) => {
      const { fecha, numero } = action.payload;
      const fechaIndex = state.findIndex((c) => c.fecha === fecha);
      if (fechaIndex !== -1) {
        state[fechaIndex].citas = state[fechaIndex].citas.filter(
          (cita) => cita.numero !== numero,
        );
      }
    },
  },
});

// Slice para las citas de check out
const citasCheckOutSlice = createSlice({
  name: 'citasCheckOut',
  initialState: [
    {
      id: '1',
      placa: 'B834620',
      cliente: 'SERVICIO DE VIAJEROS SUIZA',
      fechaIngreso: '22-11-2024 10:41 a. m.',
    },
    {
      id: '2',
      placa: 'C123456',
      cliente: 'TRANSPORTES COLOMBIA',
      fechaIngreso: '21-11-2024 03:52 p. m.',
    },
    {
      id: '3',
      placa: 'D789012',
      cliente: 'TURISMO EXPRESS',
      fechaIngreso: '20-11-2024 08:30 a. m.',
    },
  ],
  reducers: {
    // Reducer para agregar una nueva cita
    addCitaCheckOut: (state, action) => {
      state.push(action.payload);
    },
    // Reducer para eliminar una cita por id
    removeCitaCheckOut: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

// Slice para las citas completadas
const citasCompletadasSlice = createSlice({
  name: 'citasCompletadas',
  initialState: [
    {
      id: '1',
      placa: 'B834620',
      cliente: 'SERVICIO DE VIAJEROS SUIZA',
      fechaIngreso: '22-11-2024 10:41 a. m.',
    },
    {
      id: '2',
      placa: 'C123456',
      cliente: 'TRANSPORTES COLOMBIA PRUEBA',
      fechaIngreso: '21-11-2024 03:52 p. m.',
    },
    {
      id: '3',
      placa: 'D789012',
      cliente: 'TURISMO EXPRESS',
      fechaIngreso: '20-11-2024 08:30 a. m.',
    },
  ],
  reducers: {
    // Reducer para agregar una nueva cita
    addCita: (state, action) => {
      state.push(action.payload);
    },
    // Reducer para eliminar una cita por id
    removeCita: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
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
    kilometraje: '',
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
      marca: 'Sony', // Only this property
    },
    {
      id: 2,
      nombre: 'Gata',
      habilitado: false,
      infoVisible: false,
      estado: 'Regular',
      descripcion: 'Gata hidráulica para autos', // Only this property
    },
    {
      id: 3,
      nombre: 'Llave de ranas',
      habilitado: true,
      infoVisible: true,
      estado: '',
      cantidad: 2, // Only this property
    },
    {
      id: 4,
      nombre: 'Estuche emergencia',
      habilitado: false,
      infoVisible: false,
      estado: 'Malo',
      marca: 'Duracell',
      descripcion: 'Kit básico con linterna',
    },
    {
      id: 5,
      nombre: 'Repuesto',
      habilitado: false,
      infoVisible: false,
      estado: 'Regular',
      marca: 'Goodyear',
      cantidad: 1,
    },
    {
      id: 6,
      nombre: 'Cierre central',
      habilitado: true,
      infoVisible: false,
      estado: 'Regular',
      descripcion: 'Cierre automático para puertas',
      cantidad: 4,
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
        marca,
        descripcion,
        cantidad,
      } = action.payload;
      state.push({
        id,
        nombre,
        habilitado,
        infoVisible,
        estado,
        marca,
        descripcion,
        cantidad,
      });
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

// Slice para la revisión de suspensión delantera
const suspensionReviewSlice = createSlice({
  name: 'suspensionReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Amortiguador',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 2,
        nombre: 'Galleta',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 3,
        nombre: 'Resorte',
        estadoGeneral: '', // Este componente es parte de la sección general
      },
      {
        id: 4,
        nombre: 'Hule de Tope',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 5,
        nombre: 'Tijereta Sup',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 6,
        nombre: 'Tijereta Inf',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 7,
        nombre: 'Rótula Suspensión Sup',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 8,
        nombre: 'Rótula Suspensión Inf',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 9,
        nombre: 'Hules Estab. Punta',
        estadoGeneral: '', // Componente general
      },
      {
        id: 10,
        nombre: 'Hules Estab. Centro',
        estadoGeneral: '', // Componente general
      },
      {
        id: 11,
        nombre: 'Soporte de Cremallera',
        estadoGeneral: '', // Componente general
      },
      {
        id: 12,
        nombre: 'Bujes Tensoras Sup',
        estadoGeneral: '', // Componente general
      },
      {
        id: 13,
        nombre: 'Buje Tensora Inf',
        estadoGeneral: '', // Componente general
      },
      {
        id: 14,
        nombre: 'Soportes Chasis',
        estadoGeneral: '', // Componente general
      },
    ],
  },
  reducers: {
    updateSuspensionItem: (state, action) => {
      const { id, side, status } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        if (side === 'derecha') {
          item.estadoDerecha = status;
        } else if (side === 'izquierda') {
          item.estadoIzquierda = status;
        } else if (side === 'general') {
          item.estadoGeneral = status;
        }
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
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 2,
        nombre: 'Galleta Trasera',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 3,
        nombre: 'Resorte Trasero',
        estadoGeneral: '', // General component
      },
      {
        id: 4,
        nombre: 'Hule de Tope Trasero',
        estadoGeneral: '', // General component
      },
      {
        id: 5,
        nombre: 'Tijereta Sup Trasera',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 6,
        nombre: 'Tijereta Inf Trasera',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 7,
        nombre: 'Rótula Suspensión Sup Trasera',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 8,
        nombre: 'Rótula Suspensión Inf Trasera',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 9,
        nombre: 'Hules Estab. Punta Trasera',
        estadoGeneral: '', // General component
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
        else if (side === 'general') item.estadoGeneral = status;
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
        estadoGeneral: '', // General component
      },
      {
        id: 2,
        nombre: 'Discos',
        estadoGeneral: '', // General component
      },
      {
        id: 3,
        nombre: 'Pin de Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 4,
        nombre: 'Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 5,
        nombre: 'Empaque de Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 6,
        nombre: 'Mantenimiento Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 7,
        nombre: 'Tubería',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 8,
        nombre: 'Manguera',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 9,
        nombre: 'Fitting',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 10,
        nombre: 'Seguros',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 11,
        nombre: 'Zapatas',
        estadoGeneral: '', // General component
      },
      {
        id: 12,
        nombre: 'Tambor',
        estadoGeneral: '', // General component
      },
      {
        id: 13,
        nombre: 'Resortes de Zapata',
        estadoGeneral: '', // General component
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
        else if (side === 'general') item.estadoGeneral = status;
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
        estadoGeneral: '', // General component
      },
      {
        id: 2,
        nombre: 'Discos',
        estadoGeneral: '', // General component
      },
      {
        id: 3,
        nombre: 'Pin de Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 4,
        nombre: 'Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 5,
        nombre: 'Empaque de Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 6,
        nombre: 'Mantenimiento Caliper',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 7,
        nombre: 'Tubería',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 8,
        nombre: 'Manguera',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 9,
        nombre: 'Fitting',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 10,
        nombre: 'Seguros',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 11,
        nombre: 'Zapatas',
        estadoGeneral: '', // General component
      },
      {
        id: 12,
        nombre: 'Tambor',
        estadoGeneral: '', // General component
      },
      {
        id: 13,
        nombre: 'Resortes de Zapata',
        estadoGeneral: '', // General component
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
        else if (side === 'general') item.estadoGeneral = status;
      }
    },
  },
});

// Slice para la revisión de rodamientos
const rodamientosReviewSlice = createSlice({
  name: 'rodamientosReview',
  initialState: {
    items: [
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
      {
        id: 3,
        nombre: 'Bota Int',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 4,
        nombre: 'Bota Ext',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 5,
        nombre: 'Cruceta Int.',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 6,
        nombre: 'Gazas Int',
        estadoGeneral: '', // General component
      },
      {
        id: 7,
        nombre: 'Gazas Ext',
        estadoGeneral: '', // General component
      },
      {
        id: 8,
        nombre: 'Grasas',
        estadoGeneral: '', // General component
      },
      {
        id: 9,
        nombre: 'Rodamiento',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 10,
        nombre: 'Seguros',
        estadoGeneral: '', // General component
      },
      {
        id: 11,
        nombre: 'Tuerca',
        estadoGeneral: '', // General component
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
        else if (side === 'general') item.estadoGeneral = status;
      }
    },
  },
});

// Slice para la revisión de rodamientos traseros
const rodamientosBackReviewSlice = createSlice({
  name: 'rodamientosBackReview',
  initialState: {
    items: [
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
      {
        id: 3,
        nombre: 'Bota Int',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 4,
        nombre: 'Bota Ext',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 5,
        nombre: 'Cruceta Int.',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 6,
        nombre: 'Gazas Int',
        estadoGeneral: '', // General component
      },
      {
        id: 7,
        nombre: 'Gazas Ext',
        estadoGeneral: '', // General component
      },
      {
        id: 8,
        nombre: 'Grasas',
        estadoGeneral: '', // General component
      },
      {
        id: 9,
        nombre: 'Rodamiento',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 10,
        nombre: 'Seguros',
        estadoGeneral: '', // General component
      },
      {
        id: 11,
        nombre: 'Tuerca',
        estadoGeneral: '', // General component
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
        else if (side === 'general') item.estadoGeneral = status;
      }
    },
  },
});

// Slice para la revisión de dirección
const direccionReviewSlice = createSlice({
  name: 'direccionReview',
  initialState: {
    items: [
      {
        id: 1,
        nombre: 'Cremallera',
        estadoGeneral: '', // General component
      },
      {
        id: 2,
        nombre: 'Caja de Dirección',
        estadoGeneral: '', // General component
      },
      {
        id: 3,
        nombre: 'Rótulas Ext',
        estadoDerecha: '',
        estadoIzquierda: '',
      },
      {
        id: 4,
        nombre: 'Brazo Pitman',
        estadoGeneral: '', // General component
      },
      {
        id: 5,
        nombre: 'Brazo Auxiliar',
        estadoGeneral: '', // General component
      },
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
      {
        id: 8,
        nombre: 'Barra Central',
        estadoGeneral: '', // General component
      },
      {
        id: 9,
        nombre: 'Buje Cremallera',
        estadoGeneral: '', // General component
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
        else if (side === 'general') item.estadoGeneral = status;
      }
    },
  },
});

const extrasReviewSlice = createSlice({
  name: 'extrasReview',
  initialState: {
    items: [
      // Servicios Section
      {
        id: 1,
        nombre: 'Cambio Líquido Frenos',
        section: 'Servicios',
        estado: '',
      },
      { id: 2, nombre: 'Cambio Aceite', section: 'Servicios', estado: '' },
      {
        id: 3,
        nombre: 'Dir Hidráulica',
        section: 'Servicios',
        estado: '',
      },
      { id: 4, nombre: 'Escobillas', section: 'Servicios', estado: '' },

      // Acondicionamiento Exterior Section
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
  },
  reducers: {
    updateExtrasItem: (state, action) => {
      const { id, status } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.estado = status;
      }
    },
  },
});

const articuloGenericoSlice = createSlice({
  name: 'articulosGenericos',
  initialState: {
    s: [],
    malos: [],
  },
  reducers: {
    agregarArticulo: (state, action) => {
      const { nombre, estado } = action.payload;
      if (estado === '') {
        state.s.push(nombre);
      } else if (estado === 'Malo') {
        state.malos.push(nombre);
      }
    },
    eliminarArticulo: (state, action) => {
      const { nombre, estado } = action.payload;
      if (estado === '') {
        state.s = state.s.filter((articulo) => articulo !== nombre);
      } else if (estado === 'Malo') {
        state.malos = state.malos.filter((articulo) => articulo !== nombre);
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
export const { updateExtrasItem } = extrasReviewSlice.actions;
export const { agregarArticulo, eliminarArticulo } =
  articuloGenericoSlice.actions;
export const { addCitaCheckOut, removeCitaCheckOut } =
  citasCheckOutSlice.actions;
export const { addCita, removeCita } = citasSlice.actions;

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
    extrasReview: extrasReviewSlice.reducer,
    articulosGenericos: articuloGenericoSlice.reducer,
    citasCheckOut: citasCheckOutSlice.reducer,
    citasCompletadas: citasCompletadasSlice.reducer,
    citas: citasSlice.reducer,
  },
});

export default store;
