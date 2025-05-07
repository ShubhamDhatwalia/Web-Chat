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
    updateKeyword: (state, action) => {
      const { index, updatedKeyword } = action.payload;
      state.keywords[index] = updatedKeyword;
      localStorage.setItem('keywords', JSON.stringify(state.keywords));
    }
    ,
    removeKeyword: (state, action) => {
      state.keywords.splice(action.payload, 1);
      localStorage.setItem('keywords', JSON.stringify(state.keywords));
    },
    editKeyword: (state, action) => {
      const { oldKeyword, newKeyword } = action.payload;
      const index = state.keywords.findIndex(k => JSON.stringify(k) === JSON.stringify(oldKeyword));
      if (index !== -1) {
        state.keywords[index] = newKeyword;
        localStorage.setItem('keywords', JSON.stringify(state.keywords));
      }
    },
    addReplyToKeyword: (state, action) => {
      const { keywordId, reply } = action.payload;

      const keyword = state.keywords.find(k => k.id === keywordId);

      if (keyword) {
        if (!Array.isArray(keyword.replyMaterial)) {
          keyword.replyMaterial = [];
        }

        // Uniqueness check:
        const exists = keyword.replyMaterial.some(r => {
          if (reply.replyType === 'Text') {
            return r.replyType === 'Text' && r.name === reply.name;
          } else if (reply.replyType === 'Template') {
            return (
              r.replyType === 'Template' &&
              r.currentReply?.name === reply.currentReply?.name
            );
          }
          return false;
        });

        if (!exists) {
          keyword.replyMaterial.push(reply);
        }

        localStorage.setItem('keywords', JSON.stringify(state.keywords));
      }
    },


    removeReplyFromKeyword: (state, action) => {
      const { keywordId, reply } = action.payload;

      const keyword = state.keywords.find(k => k.id === keywordId);

      if (keyword && Array.isArray(keyword.replyMaterial)) {
        keyword.replyMaterial = keyword.replyMaterial.filter(r => {
          if (reply.replyType === 'Text') {
            return !(r.replyType === 'Text' && r.name === reply.name);
          } else if (reply.replyType === 'Template') {
            return !(
              r.replyType === 'Template' &&
              r.currentReply?.name === reply.currentReply?.name
            );
          }
          return true;
        });

        localStorage.setItem('keywords', JSON.stringify(state.keywords));
      }
    }



  },
});

export const { addKeyword, removeKeyword, editKeyword, updateKeyword, addReplyToKeyword, removeReplyFromKeyword } = keywordSlice.actions;
export default keywordSlice.reducer;
