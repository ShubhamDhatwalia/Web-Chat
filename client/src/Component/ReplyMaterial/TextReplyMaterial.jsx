import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTextReply, removeTextReply, editTextReply } from '../../redux/textReply/textReplySlice.js';
import edit_icon from '../../assets/edit_icon.svg';
import delete_icon from '../../assets/delete_icon.svg';
import { useLocation } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import { grey } from '@mui/material/colors';
import { addKeyword } from '../../redux/Keywords/keywordSlice.js';
import { updateKeyword } from '..//../redux/Keywords/keywordSlice.js'
import { toast } from 'react-toastify';








function TextReplyMaterial({ onClose, Keywords, selectedReplies, setSelectedReplies }) {

    const [isOpen, setIsOpen] = useState(false);
    const [textMaterial, setTextMaterial] = useState({
        replyType: "Text",
        name: "",
        content: ""
    })
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();




    const allKeywords = useSelector((state) => state.keyword.keywords);



    const { keywords } = useSelector((state) => state.keyword);

    const { textReplys } = useSelector((state) => state.textReplys);


    const location = useLocation();
    const path = location.pathname;




    const filteredReplies = textReplys.filter((reply) =>
        reply.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        
    );



    const handleChange = (e) => {
        const { name, value } = e.target;
        setTextMaterial((prev) => ({
            ...prev,
            [name]: value
        }));
    }


    const handleEdit = (index) => {
        setTextMaterial(textReplys[index]);
        setEditIndex(index);
        setIsOpen(true);

    };

    const handleClose = () => {
        setIsOpen(false);
        setTextMaterial({ replyType: "Text", name: "", content: "" });
    }



    const handleDelete = (index) => {
        const replyToDelete = textReplys[index];

        const isUsedInKeywords = allKeywords.some(keyword =>
            keyword.replyMaterial?.some(material => material.name === replyToDelete.name)
        );

        if (isUsedInKeywords) {
            toast.warning("Reply material is in use");
            return;
        }

        dispatch(removeTextReply(index));
        toast.success("Reply material deleted successfully");
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        if (editIndex !== null) {
            dispatch(editTextReply({
                oldReply: textReplys[editIndex],
                newReply: textMaterial
            }));

            toast.success("Reply material updated successfully");

        } else {
            dispatch(addTextReply(textMaterial));
            toast.success("Reply material added successfully");

        }

        setIsOpen(false);
        setTextMaterial({ replyType: "Text", name: "", content: "" });
        setEditIndex(null);



    };


    const handleFinalSubmit = () => {

        const updatedKeywords = {
            ...Keywords,
            replyMaterial: selectedReplies,
        };


        if (selectedReplies.length === 0) {
            toast.info("Please select at least one material")
        }
        else {
            const existingKeywordIndex = keywords.findIndex(
                (kw) => kw.id === Keywords.id
            );

            if (existingKeywordIndex !== -1) {

                dispatch(updateKeyword({ index: existingKeywordIndex, updatedKeyword: updatedKeywords }));
                toast.success("Keyword updated successfully");


                onClose(true);

            } else {
                // Add if it's new
                dispatch(addKeyword(updatedKeywords));
                toast.success("Keywords created successfully");
                onClose(true);

            }
        }

    };





    return (
        <>

            <div className='h-full '>
                <div className='flex px-4 mt-4 items-center  justify-between'>
                    <div className='flex items-center gap-6'>
                        <form action="" className='min-w-[150px]'>
                            <div className='search-bar w-full flex items-center max-w-[500px]  relative'>

                                <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
                                <input type="text" className='w-full bg-white rounded-md pl-[10px] pr-[40px] py-[10px] focus:outline-none !font-medium' placeholder='Search here ... ' value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                            </div>

                        </form>

                        {path == '/keywordAction' && (<div className='text-gray-500 font-semibold flex items-center flex-wrap gap-2'>
                            Selected Material:
                            {selectedReplies?.map((reply, i) => (
                                <div
                                    key={i}
                                    className='text-xs border text-nowrap border-[#FF9933] bg-[#FFFAF5] rounded-md p-2 text-[#FF9933] max-w-[150px]  overflow-hidden'
                                >
                                    <span>{reply.replyType}</span>:{" "}
                                    <span className='truncate inline-block overflow-hidden whitespace-nowrap text-ellipsis max-w-[60px] align-bottom'>
                                        {reply.name || reply.currentReply.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        )}



                    </div>


                    <div className='flex gap-4'>
                        {path == '/keywordAction' && (<>
                            <button type='button ' className='bg-red-50 border border-red-600 cursor-pointer text-red-600  px-4 py-1 rounded-md hover:bg-red-100 transition duration-200' onClick={onClose}>
                                Cancel
                            </button>
                            <button type='button ' className='bg-green-50 border border-green-600 cursor-pointer text-green-600  px-4 py-1 rounded-md hover:bg-green-100 transition duration-200' onClick={handleFinalSubmit}>
                                Save
                            </button></>)}
                        <button type='button ' className='bg-green-600 cursor-pointer text-white  px-4 py-2 rounded-md hover:bg-green-700 transition duration-200' onClick={() => setIsOpen(true)}>
                            Add
                        </button>
                    </div>
                </div>




                {isOpen && (
                    <div className='fixed bg-black/80 inset-0 z-50 flex items-center justify-center'>


                        <div className='bg-white rounded-lg p-4 max-w-[600px] w-full '>

                            <div className='flex items-center justify-between border-b border-gray-300 pb-2'>
                                <h4 className='text-lg font-semibold'>New Text Material</h4>
                                <i className="fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600" onClick={handleClose}></i>
                            </div>


                            <form onSubmit={handleSubmit}>
                                <div className='flex flex-col gap-2 mt-8'>
                                    <label htmlFor="" className='font-semibold text-gray-700 text-sm'>Material Name</label>
                                    <input type="text" required placeholder='Please input' className=' focus:outline-none text-sm bg-gray-100 rounded-lg p-2' name='name' value={textMaterial.name} onChange={handleChange} />
                                </div>



                                <div className='flex flex-col gap-2 mt-8'>
                                    <label htmlFor="" className='font-semibold text-gray-700 text-sm'>Material Content</label>
                                    <textarea id="" required className='bg-gray-100 rounded-lg p-2 text-sm focus:outline-none' rows={5} placeholder='Please input' name='content' value={textMaterial.content} onChange={handleChange}></textarea>
                                </div>



                                <button type='submit' className='bg-green-600 hover:bg-green-700 cursor-pointer rounded-lg px-4 py-2 text-white mt-6 float-right' >Save</button>
                            </form>

                        </div>

                    </div>
                )}

                <div className='mt-6 mb-4 grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] items-start max-h-[70vh] px-4 overflow-auto'>
                    {filteredReplies.map((reply, index) => (
                        <div key={index} className='bg-white rounded-lg p-4 max-w-[100%] h-[200px]  w-full hover:drop-shadow-xl'>
                            <div className='flex items-center justify-between gap-4'>

                                {path == '/keywordAction' && (
                                    <Checkbox
                                        color="success"
                                        checked={selectedReplies?.some(item => item.name === reply.name)}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            const currentReply = textReplys[index];

                                            if (isChecked) {

                                                setSelectedReplies(prev => [...prev, currentReply]);
                                            } else {

                                                setSelectedReplies(prev => prev.filter(item => item.name !== currentReply.name));
                                            }
                                        }}
                                        sx={{
                                            padding: 0,
                                            '& svg': {
                                                fontSize: 32,
                                            },
                                            color: grey[500],
                                        }}
                                    />

                                )}


                                <h4 className={` ${path == '/keywordAction' ? 'hidden' : ' truncate font-semibold text-green-600'}`}>{reply.name}</h4>

                                <div className='flex items-center gap-2'>
                                    <div
                                        className='w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-gray-100 cursor-pointer hover:border-green-500'
                                        onClick={() => {
                                            handleEdit(index)
                                        }}
                                    >
                                        <img src={edit_icon} alt="edit" />
                                    </div>
                                    <div
                                        className='w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 bg-gray-100 cursor-pointer hover:border-red-500'
                                        onClick={() => { handleDelete(index) }}
                                    >
                                        <img src={delete_icon} alt="delete" />
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4 text-sm '>
                                <h4 className={` ${path == '/keywordAction' ? 'text-green-600 truncate font-semibold text-[16px] mt-2' : 'hidden'}`}>{reply.name}</h4>

                                <div className=' max-h-[100px] leading-4.5 overflow-auto'>
                                    <p className='break-words mt-2   whitespace-pre-wrap'>{reply.content}</p>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default TextReplyMaterial