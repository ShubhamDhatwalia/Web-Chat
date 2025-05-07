import { createSlice } from '@reduxjs/toolkit';

const localStorageReplies = localStorage.getItem('selectedReplies');
const initialState = {
    selectedReplies: localStorageReplies ? JSON.parse(localStorageReplies) : [],
};

const saveToLocalStorage = (selectedReplies) => {
    localStorage.setItem('selectedReplies', JSON.stringify(selectedReplies));
};

const selectedRepliesSlice = createSlice({
    name: 'selectedReplies',
    initialState,
    reducers: {
        addSelectedReply: (state, action) => {
            const newReplies = Array.isArray(action.payload) ? action.payload : [action.payload];

            newReplies.forEach((newReply) => {
                let exists;

                if (newReply.replyType && newReply.currentReply) {
                    exists = state.selectedReplies.some(
                        reply =>
                            reply.replyType === newReply.replyType &&
                            reply.currentReply?.name === newReply.currentReply.name
                    );
                } else {
                    exists = state.selectedReplies.some(reply => reply.name === newReply.name);
                }

                if (!exists) {
                    state.selectedReplies.push(newReply);
                }
            });

            saveToLocalStorage(state.selectedReplies); // 💾 Save
        },

        removeSelectedReply: (state, action) => {
            const replyToRemove = action.payload;

            state.selectedReplies = state.selectedReplies.filter((reply) => {
                if (replyToRemove.replyType && replyToRemove.currentReply) {
                    return !(
                        reply.replyType === replyToRemove.replyType &&
                        reply.currentReply?.name === replyToRemove.currentReply.name
                    );
                } else {
                    return reply.name !== replyToRemove.name;
                }
            });

            saveToLocalStorage(state.selectedReplies); // 💾 Save
        },

        clearSelectedReplies: (state) => {
            state.selectedReplies = [];
            saveToLocalStorage([]); // 💾 Clear from localStorage
        }
    },
});

export const { addSelectedReply, removeSelectedReply, clearSelectedReplies } = selectedRepliesSlice.actions;
export default selectedRepliesSlice.reducer;
