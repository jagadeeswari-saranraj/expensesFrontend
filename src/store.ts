import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './reducer/expensesReducer';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
  },
});


// Export types
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;