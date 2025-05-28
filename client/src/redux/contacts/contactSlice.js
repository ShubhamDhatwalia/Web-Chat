import { createSlice } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { toast } from 'react-toastify';







const url = "https://script.google.com/macros/s/AKfycbyVTLMEeDrWpct8HRDNLig1WOFp49w_JIOzUZiw5sTJrzcycZBUqkovD_EKYHpwaJbA3A/exec";

const fetchContacts = async () => {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        console.log(data);
        localStorage.setItem('contacts', JSON.stringify(data));

    } catch (err) {
        console.error("Failed to fetch contacts", err);

    }
};

fetchContacts();







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
            state.contacts = state.contacts.filter(contact => contact.phone !== action.payload);
            localStorage.setItem('contacts', JSON.stringify(state.contacts));
        },
        updateContact: (state, action) => {
            const { phone, updatedData } = action.payload;
            const index = state.contacts.findIndex(contact => contact.phone === phone);
            if (index !== -1) {
                state.contacts[index] = {
                    ...state.contacts[index],
                    ...updatedData,
                };
                localStorage.setItem('contacts', JSON.stringify(state.contacts));
                toast.success('Contact updated successfully');
            } else {
                toast.error('Contact not found');
            }
        },


        addTags: (state, action) => {
            const { phone, tags } = action.payload;
            const contact = state.contacts.find(contact => contact.phone === phone);
            if (contact) {
                contact.tags = [...new Set([...(contact.tags || []), ...tags])];
                localStorage.setItem('contacts', JSON.stringify(state.contacts));
                toast.success('Tag added successfully');
            }
        },
        removeTags: (state, action) => {
            const { phone, tag } = action.payload;
            const contact = state.contacts.find(contact => contact.phone === phone);
            if (contact) {
                contact.tags = contact.tags.filter(t => t !== tag);
                localStorage.setItem('contacts', JSON.stringify(state.contacts));
                toast.success('Tag removed successfully');
            }
        },
        addNotes: (state, action) => {
            const { phone, notes } = action.payload; // notes will be an array of objects [{ text, time }]
            const contact = state.contacts.find(contact => contact.phone === phone);
            if (contact) {
                const newNotes = [...(contact.notes || []), ...notes];
                // Avoid duplicates based on text + time
                contact.notes = newNotes;
                localStorage.setItem('contacts', JSON.stringify(state.contacts));
                toast.success('Notes added successfully');
            }
        },

        removeNotes: (state, action) => {
            const { phone, time } = action.payload;
            const contact = state.contacts.find(contact => contact.phone === phone);
            if (contact) {
                contact.notes = contact.notes.filter(n => n.time !== time);
                localStorage.setItem('contacts', JSON.stringify(state.contacts));
                toast.success('Notes removed successfully');
            }
        },
        updateNote: (state, action) => {
            const { phone, updatedNote } = action.payload;
            const user = state.contacts.find((c) => c.phone === phone);
            if (user) {
                user.notes = user.notes.map((note) =>
                    note.time === updatedNote.time ? updatedNote : note
                );
                toast.success('Note updated successfully');
            }
        },


    }
});

export const { addContact, deleteContact, updateContact, addTags, removeTags, addNotes, removeNotes, updateNote } = contactSlice.actions;
export default contactSlice.reducer;
