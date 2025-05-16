import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';


const initialState = {
    Chatbots: JSON.parse(localStorage.getItem('Chatbots')) || []
}

const ChatbotSlice = createSlice({
    name: 'Chatbot',
    initialState,
    reducers: {
        addChatbot: (state, action) => {
            const newChatbot = action.payload;

            const exists = state.Chatbots.some(bot => bot.name === newChatbot.name);

            if (!exists) {
                state.Chatbots.push(newChatbot);
                localStorage.setItem('Chatbots', JSON.stringify(state.Chatbots));
            } else {
                toast.error(`Chatbot already exists!`);
            }
        },

        removeChatbot: (state, action) => {
            state.Chatbots.splice(action.payload, 1);
            localStorage.setItem('Chatbots', JSON.stringify(state.Chatbots));
        },
        updateChatbotFlow: (state, action) => {
            const { id, flow } = action.payload;
            const chatbotIndex = state.Chatbots.findIndex(bot => bot.id === id);
            if (chatbotIndex !== -1) {
                state.Chatbots[chatbotIndex].flow = flow;
                state.Chatbots[chatbotIndex].lastUpdated = new Date().toISOString();
                localStorage.setItem('Chatbots', JSON.stringify(state.Chatbots));
            }
        },
        updateChatbotName: (state, action) => {
            const { id, newName } = action.payload;
            const chatbot = state.Chatbots.find(bot => bot.id === id);
            if (chatbot) {
                chatbot.name = newName;
                chatbot.lastUpdated = new Date().toISOString();
                localStorage.setItem('Chatbots', JSON.stringify(state.Chatbots));
                toast.success(`Chatbot name updated to "${newName}"`);
            } else {
                toast.error("Chatbot not found.");
            }
        },


    }
})

export const { addChatbot, removeChatbot, updateChatbotFlow, updateChatbotName } = ChatbotSlice.actions
export default ChatbotSlice.reducer