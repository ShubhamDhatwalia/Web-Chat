import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContact } from '../redux/contacts/contactSlice.js';
import { toast } from 'react-toastify';

function ContactList() {
    const dispatch = useDispatch();
    const contacts = useSelector((state) => state.contact.contacts);
    console.log(contacts);

    const handleDelete = (phone) => {
        dispatch(deleteContact(phone));
        toast.success("Contact removed successfully!");
    }





    return (
        <div className='text-gray-600'>
            <table className="table-auto w-full">
                <thead className='text-lg text-gray-500'>
                    <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap">
                        <th className=" py-4 text-left">Basic Info</th>
                        <th className="p py-4">Phone Number</th>
                        <th className=" py-4">Source</th>
                        <th className=" py-4">Contact Attributes</th>
                        <th className=" py-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts && contacts.length > 0 ? (
                        contacts.map((contact, index) => (
                            <tr key={index} className=" text-center font-semibold  text-gray-500">
                                <td className=" py-4 text-left">{contact.name}</td>
                                <td className=" py-4">{contact.phone}</td>
                                <td className="py-4"> {contact.source || 'N/A'} </td>
                                <td className=" py-4">
                                    {contact.attributes && contact.attributes.length > 0 ? (
                                        <ul className="text-center">
                                            {contact.attributes.map((attr, i) => (
                                                <li key={i} >
                                                    <span className='bg-gray-100 rounded-md px-2 py-1'>{attr.name}:  <span className='text-sm'>{attr.value}</span> </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>—</span>
                                    )}
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex gap-4 justify-end">
                                        <button className="text-blue-500 hover:underline">Edit</button>
                                        <i className="fa-solid fa-trash bg-gray-100 text-sm p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer" onClick={() => handleDelete(contact.phone)}></i>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                No contacts found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ContactList;
