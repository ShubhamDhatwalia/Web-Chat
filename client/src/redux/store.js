import { configureStore } from '@reduxjs/toolkit';
import templateReducer from './templateSlice.js';
import phoneNumberReducer from './phoneNumberSlice.js';
import keywordReducer from './Keywords/keywordSlice.js';
import textReplyReducer from './textReply/textReplySlice.js';
import campaignReducer from './Campaign/campaignSlice.js';
import ChatbotReducer from'./Chatbot/ChatbotSlice..js';





export const store = configureStore({
  reducer: {
    templates: templateReducer,
    phoneNumbers: phoneNumberReducer,
    keyword: keywordReducer,
    textReplys: textReplyReducer,
    campaign: campaignReducer,
    chatbot: ChatbotReducer,
  },
});


export default store; 