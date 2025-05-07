import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    textReplys: JSON.parse(localStorage.getItem('textReply')) || [],

};

const textReplySlice = createSlice({
    name: 'textReply',
    initialState,
    reducers: {
        addTextReply: (state, action) => {
            state.textReplys.push(action.payload);
           
            localStorage.setItem('textReply', JSON.stringify(state.textReplys));

        },
        removeTextReply: (state, action) => {
            state.textReplys.splice(action.payload, 1);
            localStorage.setItem('textReply', JSON.stringify(state.textReplys));
        },

        editTextReply: (state, action) => {
            const { oldReply, newReply } = action.payload;
            const index = state.textReplys.findIndex(t => JSON.stringify(t) === JSON.stringify(oldReply));
            if (index !== -1) {
                state.textReplys[index] = newReply;
                localStorage.setItem('textReply', JSON.stringify(state.textReplys));
            }
        }
    }
});

export const { addTextReply, removeTextReply, editTextReply } = textReplySlice.actions;
export default textReplySlice.reducer;