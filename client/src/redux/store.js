import { configureStore } from '@reduxjs/toolkit';
import templateReducer from './templateSlice.js';
import phoneNumberReducer from './phoneNumberSlice.js';
import keywordReducer from './Keywords/keywordSlice.js';
import textReplyReducer from './textReply/textReplySlice.js';
import selectedRepliesReducer from './selectedReplies/selectedReplies.js';





export const store = configureStore({
  reducer: {
    templates: templateReducer,
    phoneNumbers: phoneNumberReducer,
    keyword: keywordReducer,
    textReplys: textReplyReducer,
    selectedReplies: selectedRepliesReducer,
  },
});


export default store; 