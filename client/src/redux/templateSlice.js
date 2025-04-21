import { createSlice } from '@reduxjs/toolkit';
import { fetchTemplates, deleteTemplate } from './templateThunks';

const templateSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTemplates(state) {
      state.templates = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
        state.loading = false;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t.id !== action.payload);
      });
  },
});

export const { clearTemplates } = templateSlice.actions;

export default templateSlice.reducer;
