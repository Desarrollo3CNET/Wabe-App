import { createSlice } from '@reduxjs/toolkit';

// Slice para las citas
const citasSlice = createSlice({
  name: 'citas',
  initialState: [],
  reducers: {
    addCita: (state, action) => {
      const { fecha, nuevaCita } = action.payload;
      const fechaIndex = state.findIndex((c) => c.fecha === fecha);
      if (fechaIndex !== -1) {
        state[fechaIndex].citas.push(nuevaCita);
      } else {
        state.push({ fecha, citas: [nuevaCita] });
      }
    },
    removeCita: (state, action) => {
      const { fecha, numero } = action.payload;
      const fechaIndex = state.findIndex((c) => c.fecha === fecha);
      if (fechaIndex !== -1) {
        state[fechaIndex].citas = state[fechaIndex].citas.filter(
          (cita) => cita.numero !== numero,
        );
      }
    },
    clearCitas: (state) => {
      return [];
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
    addCitaCheckOut: (state, action) => {
      state.push(action.payload);
    },
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
    addCita: (state, action) => {
      state.push(action.payload);
    },
    removeCita: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addCita, removeCita, clearCitas } = citasSlice.actions;
export const { addCitaCheckOut, removeCitaCheckOut } =
  citasCheckOutSlice.actions;
export const { addCita: addCitaCompletada, removeCita: removeCitaCompletada } =
  citasCompletadasSlice.actions;

export const citasReducer = citasSlice.reducer;
export const citasCheckOutReducer = citasCheckOutSlice.reducer;
export const citasCompletadasReducer = citasCompletadasSlice.reducer;
