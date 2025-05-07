import { configureStore } from '@reduxjs/toolkit';
import templateReducer from './templateSlice.js';
import phoneNumberReducer from './phoneNumberSlice.js';
import keywordReducer from './Keywords/keywordSlice.js';
import textReplyReducer from './textReply/textReplySlice.js';




export const store = configureStore({
  reducer: {
    templates: templateReducer,
    phoneNumbers: phoneNumberReducer,
    keyword: keywordReducer,
    textReplys: textReplyReducer,
   
  },
});


export default store; 