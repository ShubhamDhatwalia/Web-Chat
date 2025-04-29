import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  keywords: JSON.parse(localStorage.getItem('keywords')) || [],
};

const keywordSlice = createSlice({
  name: 'keyword',
  initialState,
  reducers: {
    addKeyword: (state, action) => {
      state.keywords.push(action.payload);
      localStorage.setItem('keywords', JSON.stringify(state.keywords));
    },
    removeKeyword: (state, action) => {
      state.keywords.splice(action.payload, 1); // Remove by index
      localStorage.setItem('keywords', JSON.stringify(state.keywords));
    }
    
  },
});

export const { addKeyword, removeKeyword } = keywordSlice.actions;
export default keywordSlice.reducer;
