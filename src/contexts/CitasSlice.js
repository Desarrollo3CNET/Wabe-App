import { createSlice } from '@reduxjs/toolkit';

// Slice para las citas
const citasSlice = createSlice({
  name: 'citas',
  initialState: [],
  reducers: {
    addCita: (state, action) => {
      state.push(action.payload); // Agrega la nueva cita al estado
    },
    clearCitas: () => {
      return [];
    },
  },
});

export const { clearCitas, addCita } = citasSlice.actions;
export const citasReducer = citasSlice.reducer;
