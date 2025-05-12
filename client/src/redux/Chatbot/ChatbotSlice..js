import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Chatbots: JSON.parse(localStorage.getItem('Chatbots')) || []
}

const ChatbotSlice = createSlice({
    name: 'Chatbot',
    initialState,
    reducers: {
        addChatbot: (state, action) => {
            state.Chatbots.push(action.payload)
            localStorage.setItem('Chatbots', JSON.stringify(state.Chatbots))
        },
        removeChatbot: (state, action) => {
            state.Chatbots.splice(action.payload, 1);
            localStorage.setItem('Chatbots', JSON.stringify(state.Chatbots));
        },
    }
})

export const { addChatbot, removeChatbot } = ChatbotSlice.actions
export default ChatbotSlice.reducer