import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteContact } from '../../redux/contacts/contactSlice.js';
import { toast } from 'react-toastify';



function ContactList({ onSearch,  setSelectedContact }) {
    const dispatch = useDispatch();
    const contacts = useSelector((state) => state.contact.contacts);
    const [limit, setLimit] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
  


    const handleDelete = (phone) => {
        dispatch(deleteContact(phone));
        toast.success("Contact removed successfully!");
    }


    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(onSearch.toLowerCase()) ||
        contact.phone.toString().includes(onSearch) ||
        (contact.source && contact.source.toLowerCase().includes(onSearch.toLowerCase()))
    );


    const totalPages = Math.ceil(filteredContacts.length / limit);
    const currentData = filteredContacts.slice((currentPage - 1) * limit, currentPage * limit);

    const handleNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
    const handlePrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

    const handleEdit = (contact) => {
        setSelectedContact(contact);
        
    };



    return (
        <>
            <div className='text-gray-600 flex flex-col justify-between h-full px-8'>
                <table className="table-auto w-full">
                    <thead className='text-lg text-gray-600'>
                        <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap">
                            <th className=" py-4 text-left">Basic Info</th>
                            <th className="p py-4">Phone Number</th>
                            <th className=" py-4">Source</th>
                            <th className=" py-4">Contact Attributes</th>
                            <th className=" py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData && currentData.length > 0 ? (
                            currentData.map((contact, index) => (
                                <tr key={index} className=" text-center font-semibold  text-gray-500">
                                    <td className=" py-4 text-left">{contact.name}</td>
                                    <td className=" py-4">{contact.phone}</td>
                                    <td className="py-4 flex justify-center" > <div className='bg-green-50  border border-green-600 text-sm text-green-600 rounded-md px-2 py-1'>{contact.source || 'WebChat'}</div> </td>
                                    <td className=" py-4 max-w-[200px]">
                                        {contact.attributes && contact.attributes.length > 0 ? (
                                            <ul className="text-center flex justify-center flex-wrap gap-4">
                                                {contact.attributes.map((attr, i) => (
                                                    <li key={i} >
                                                        <span className='border border-[FF9933] bg-[#FFFAF5] text-nowrap rounded-md inline py-1 px-2 text-[#FF9933]'>{attr.name}:  <span className='text-sm'>{attr.value}</span> </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>—</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-right">
                                        <div className="flex gap-4 justify-end">
                                            <i className="fa-solid fa-pen-to-square bg-gray-100 p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-100 cursor-pointer" onClick={() => handleEdit(contact)} ></i>
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


            <div className='flex items-center justify-between px-8 py-5 text-sm bg-gray-100'>
                <div className='flex items-center text-lg font-semibold text-gray-600 gap-2'>
                    <span>Items per page:</span>
                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border focus:outline-none border-gray-300 rounded px-2 py-1">
                        {[2, 3, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>

                <div className='flex items-center text-lg font-semibold text-gray-600 gap-4'>
                    <span className='mr-4'>Page {currentPage} of {totalPages}</span>
                    <button onClick={handlePrev} disabled={currentPage === 1}><i className={`fas fa-angle-left text-lg  ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`} /></button>
                    <button onClick={handleNext} disabled={currentPage === totalPages}><i className={`fas fa-angle-right text-lg  ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 cursor-pointer'}`} /></button>
                </div>
            </div>

            


        </>
    );
}

export default ContactList;
