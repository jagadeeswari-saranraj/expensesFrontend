import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

export interface Expense {
  _id: string;
  user: string;
  description: string;
  total: number;
  byCategory: Record<string, number>;
  date: string;
}

export interface Expenses {
  user: string;
  description: string;
  total: number;
  byCategory: Record<string, number>;
  date: string;
}

// Define the expected argument type
interface EditExpensePayload {
  id: string;
  expense: {
    user: string;
    description: string;
    total: number;
    byCategory: Record<string, number>;
    date: string;
  };
}

interface queryParam {
    sortField: string,
    sortOrder: string,
}
// ✅ Async Thunks

// Get all expenses
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async ({sortField, sortOrder}: queryParam) => {
  const response = await axios.get(`${API_URL}?field=${sortField}&sort=${sortOrder}`);
  return response.data;
});

// Get expense by ID
export const fetchExpenseById = createAsyncThunk('expenses/fetchExpenseById', async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
});

// Add new expense
export const addExpenseAPI = createAsyncThunk('expenses/addExpenseAPI', async (expense: Expenses) => {
  const response = await axios.post(API_URL, expense);
  return response.data;
});

// Edit expense by ID
export const editExpenseAPI = createAsyncThunk('expenses/editExpenseAPI', async ({ id, expense }: EditExpensePayload) => {
  const response = await axios.put(`${API_URL}/${id}`, expense);
  return response.data;
});

// Delete expense by ID
export const deleteExpenseAPI = createAsyncThunk('expenses/deleteExpenseAPI', async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// ✅ Slice

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    list: [],
    currentExpense: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.currentExpense = action.payload;
      })
      .addCase(addExpenseAPI.fulfilled, (state, action) => {
        state.currentExpense = action.payload;
      })
      .addCase(editExpenseAPI.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(deleteExpenseAPI.fulfilled, (state, action) => { 
        state.list = state.list.filter((exp: Expense) => exp._id !== action.payload);  
      });
  }
});

export default expensesSlice.reducer;
