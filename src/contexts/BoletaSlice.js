import { createSlice } from '@reduxjs/toolkit';

const boletaSlice = createSlice({
  name: 'boleta',
  initialState: {
    CITCLIE_CODE: '',
    BOL_CODE: '',
    EMP_CODE: '',
    CLI_CODE: '',
    VEH_CODE: '',
    TIPTRA_CODE: '',
    BOL_FECHA: '',
    BOL_CLI_NOMBRE: '',
    BOL_CLI_TELEFONO: '',
    BOL_VEH_PLACA: '',
    BOL_VEH_ANIO: '',
    BOL_VEH_MARCA: '',
    BOL_VEH_ESTILO: 'Sedán',
    BOL_VEH_MODELO: '',
    BOL_VEH_COLOR: '',
    BOL_VEH_KM: '',
    BOL_VEH_COMBUSTIBLE: '',
    BOL_CREATEDATE: '',
    BOL_UPDATEDATE: '',
    BOL_CREATEUSER: '',
    BOL_UPDATEUSER: '',
    BOL_FIRMA_CLIENTE: '',
    BOL_ESTADO: 0,
    BOL_UNWASHED: false,
    BOL_DELIVERED: false,
    BOL_CLI_CORREO: '',
    CITCLI_CODE: '',
    ACC_ACCESORIOS: [],
    BOL_FIRMA_CONSENTIMIENTO: '',
    BOL_ENTREGADOPOR: '',
    BOL_OBSERVACIONES: '',
    BOL_RECIBIDOPOR: '',
    BOL_RECIBIDOCONFORME: '',
    BOL_CAR_EXQUEMA: '',
    VEH_VEHICULO: {},
    LIST_IMAGES: [],
    paths: [],
    undonePaths: [],
    fechaIngreso: '',
    horaIngreso: '',
  },
  reducers: {
    // Reducer genérico para actualizar cualquier propiedad con {key, value}
    setProperty: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    // Reducer para añadir una nueva Imagen
    addImage: (state, action) => {
      state.LIST_IMAGES.push(action.payload);
    },
    // Reducer para setear un Imagenes
    setImages: (state, action) => {
      state.LIST_IMAGES = action.payload; // Sobrescribe la lista completa de imágenes
    },
    // Reducer para alternar la selección de un Image por ID
    toggleSelectImage: (state, action) => {
      const id = action.payload;
      const Image = state.LIST_IMAGES.find((item) => item.id === id);
      if (Image) {
        Image.selected = !Image.selected;
      }
    },
    // Reducer para eliminar LIST_IMAGES seleccionados
    deleteSelectedImage: (state) => {
      state.LIST_IMAGES = state.LIST_IMAGES.filter((item) => !item.selected);
    },
    // Reducer para añadir un nuevo path
    addPath: (state, action) => {
      state.paths.push(action.payload);
      state.undonePaths = [];
    },
    // Reducer para deshacer el último path
    undoPath: (state) => {
      if (state.paths.length > 0) {
        const lastPath = state.paths.pop();
        state.undonePaths.unshift(lastPath);
      }
    },
    // Reducer para rehacer el último path deshecho
    redoPath: (state) => {
      if (state.undonePaths.length > 0) {
        const lastUndonePath = state.undonePaths.shift();
        state.paths.push(lastUndonePath);
      }
    },
    // Reducer para limpiar todos los paths
    clearPaths: (state) => {
      state.paths = [];
      state.undonePaths = [];
    },
    // Reducer para alternar el estado de "BOL_UNWASHED"
    toggleDirty: (state) => {
      state.BOL_UNWASHED = !state.BOL_UNWASHED;
    },
    // Reducer para añadir un accesorio
    addAccesorio: (state, action) => {
      state.ACC_ACCESORIOS.push(action.payload);
    },
    // Reducer para actualizar un accesorio existente
    updateAccesorio: (state, action) => {
      const { TIPACC_CODE, updates } = action.payload;
      const accesorio = state.ACC_ACCESORIOS.find(
        (item) => item.TIPACC_CODE === TIPACC_CODE,
      );
      if (accesorio) {
        Object.assign(accesorio, updates);
      }
    },
    // Reducer para eliminar un accesorio por ID
    removeAccesorio: (state, action) => {
      state.ACC_ACCESORIOS = state.ACC_ACCESORIOS.filter(
        (item) => item.TIPACC_CODE !== action.payload,
      );
    },
    // Reducer para alternar el estado de 'habilitado' en un accesorio
    toggleAccesorio: (state, action) => {
      const TIPACC_CODE = action.payload; // ID del accesorio a modificar
      const accesorio = state.ACC_ACCESORIOS.find(
        (item) => item.TIPACC_CODE === TIPACC_CODE,
      );
      if (accesorio) {
        accesorio.habilitado = !accesorio.habilitado;
        // Si 'habilitado' es falso, también establecer 'infoVisible' en falso
        if (!accesorio.habilitado) {
          accesorio.infoVisible = false;
        }
      }
    },

    // Reducer para alternar el estado de 'infoVisible' en un accesorio
    toggleInfo: (state, action) => {
      const TIPACC_CODE = action.payload; // ID del accesorio a modificar
      const accesorio = state.ACC_ACCESORIOS.find(
        (item) => item.TIPACC_CODE === TIPACC_CODE,
      );
      if (accesorio) {
        accesorio.infoVisible = !accesorio.infoVisible;
      }
    },

    // Reducer para setear toda la data de la boleta
    setBoletaData: (state, action) => {
      const data = action.payload;
      Object.keys(data).forEach((key) => {
        if (state.hasOwnProperty(key)) {
          state[key] = data[key];
        }
      });
    },
    resetAccesorios: (state) => {
      state.ACC_ACCESORIOS = state.ACC_ACCESORIOS.map((accesorio) => ({
        ...accesorio, // Mantiene todas las propiedades del accesorio
        habilitado: false,
        infoVisible: false,
        ...(accesorio.TIPACC_SETMARCA !== undefined && { TIPACC_SETMARCA: '' }),
        ...(accesorio.TIPACC_SETESTADO !== undefined && {
          TIPACC_SETESTADO: '',
        }),
        ...(accesorio.TIPACC_SETDESCRIPCION !== undefined && {
          TIPACC_SETDESCRIPCION: '',
        }),
        ...(accesorio.TIPACC_SETCANTIDAD !== undefined && {
          TIPACC_SETCANTIDAD: 0,
        }),
      }));
    },

    // Reducer para limpiar el estado y restablecerlo al estado inicial
    resetBoleta: (state) => {
      Object.assign(state, {
        BOL_CODE: '',
        EMP_CODE: '',
        CLI_CODE: '',
        VEH_CODE: '',
        TIPTRA_CODE: '',
        BOL_FECHA: '',
        BOL_CLI_NOMBRE: '',
        BOL_CLI_TELEFONO: '',
        BOL_VEH_PLACA: '',
        BOL_VEH_ANIO: '',
        BOL_VEH_MARCA: '',
        BOL_VEH_ESTILO: '',
        BOL_VEH_MODELO: '',
        BOL_VEH_COLOR: '',
        BOL_VEH_KM: '',
        BOL_VEH_COMBUSTIBLE: '',
        BOL_CREATEDATE: '',
        BOL_UPDATEDATE: '',
        BOL_CREATEUSER: '',
        BOL_UPDATEUSER: '',
        BOL_FIRMA_CLIENTE: '',
        BOL_ESTADO: '',
        BOL_UNWASHED: '',
        BOL_DELIVERED: '',
        BOL_CLI_CORREO: '',
        CITCLI_CODE: '',
        ACC_ACCESORIOS: [],
        BOL_FIRMA_CONSENTIMIENTO: '',
        BOL_ENTREGADOPOR: '',
        BOL_OBSERVACIONES: '',
        BOL_RECIBIDOPOR: '',
        BOL_RECIBIDOCONFORME: '',
        BOL_CAR_EXQUEMA: '',
        LIST_IMAGES: [],
        paths: [],
        undonePaths: [],
        fechaIngreso: '',
        horaIngreso: '',
      });
    },
  },
});

export const {
  setProperty,
  addImage,
  toggleSelectImage,
  deleteSelectedImage,
  addPath,
  undoPath,
  redoPath,
  clearPaths,
  toggleDirty,
  addAccesorio,
  updateAccesorio,
  removeAccesorio,
  toggleAccesorio,
  toggleInfo,
  setBoletaData,
  setImages,
  resetBoleta,
  resetAccesorios,
} = boletaSlice.actions;

export default boletaSlice.reducer;
