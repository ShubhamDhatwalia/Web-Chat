import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


const initialState = {
    contacts: JSON.parse(localStorage.getItem('contacts')) || [],
};

const contactSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        addContact: (state, action) => {
            state.contacts.push(action.payload);
            localStorage.setItem('contacts', JSON.stringify(state.contacts));
            toast.success('Contact added successfully');
        },
        deleteContact: (state, action) => {
            state.contacts = state.contacts.filter((contact) => contact.phone !== action.payload);
            localStorage.setItem('contacts', JSON.stringify(state.contacts));
            
        }

    }
});

export const { addContact, deleteContact } = contactSlice.actions;
export default contactSlice.reducer;
