import { configureStore } from '@reduxjs/toolkit';
import AppSlice from './AppSlice';
import BoletaSlice from './BoletaSlice';
import { citasReducer } from './CitasSlice';
import RevisionSlice from './RevisionSlice';

const store = configureStore({
  reducer: {
    app: AppSlice,
    boleta: BoletaSlice,
    citas: citasReducer,
    revision: RevisionSlice,
  },
});

export default store;
