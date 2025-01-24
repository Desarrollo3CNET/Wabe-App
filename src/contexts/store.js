import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './AppSlice';
import BoletaSlice from './BoletaSlice';
import {
  citasReducer,
  citasCheckOutReducer,
  citasCompletadasReducer,
} from './CitasSlice';
import RevisionSlice from './RevisionSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    boleta: BoletaSlice,
    citas: citasReducer,
    citasCheckOut: citasCheckOutReducer,
    citasCompletadas: citasCompletadasReducer,
    revision: RevisionSlice,
  },
});

export default store;
