import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTextReply, removeTextReply, editTextReply } from '../../redux/textReply/textReplySlice.js';
import edit_icon from '../../assets/edit_icon.svg';
import delete_icon from '../../assets/delete_icon.svg';






function TextReplyMaterial() {

    const [isOpen, setIsOpen] = useState(false);
    const [textMaterial, setTextMaterial] = useState({
        replyType: "text",
        name: "",
        content: ""
    })
    const [editIndex, setEditIndex] = useState(null);



    const dispatch = useDispatch();


    const { textReplys } = useSelector((state) => state.textReplys);
   



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
        setTextMaterial({ replyType: "text", name: "", content: "" });
     }

    const handleDelete = (index) => {
        dispatch(removeTextReply(index));
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editIndex !== null) {
            dispatch(editTextReply({
                oldReply: textReplys[editIndex],
                newReply: textMaterial
            }));
        } else {
            dispatch(addTextReply(textMaterial));
        }
    
        setIsOpen(false);
        setTextMaterial({ replyType: "text", name: "", content: "" });
        setEditIndex(null);
    };
    




    return (
        <>

            <div>
                <div className='flex items-center justify-between'>
                    <form action="" className=''>
                        <div className='search-bar w-full flex items-center max-w-[500px]  relative'>

                            <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
                            <input type="text" className='w-full bg-white rounded-md pl-[10px] pr-[40px] py-[10px] focus:outline-none !font-medium' placeholder='Search here ... '
                            />

                        </div>
                    </form>


                    <button type='button ' className='bg-green-600 cursor-pointer text-white  px-4 py-2 rounded-md hover:bg-green-700 transition duration-200' onClick={() => setIsOpen(true)}>
                        Add
                    </button>
                </div>




                {isOpen && (
                    <div className='fixed bg-black/70 inset-0 z-50 flex items-center justify-center'>


                        <div className='bg-white rounded-lg p-4 max-w-[600px] w-full '>

                            <div className='flex items-center justify-between border-b border-gray-300 pb-2'>
                                <h4 className='text-lg font-semibold'>New Text Material</h4>
                                <i className="fa-solid fa-xmark text-2xl cursor-pointer hover:scale-110 text-red-600" onClick={handleClose}></i>
                            </div>


                            <form action="">
                                <div className='flex flex-col gap-2 mt-8'>
                                    <label htmlFor="" className='font-semibold text-gray-700 text-sm'>Material Name</label>
                                    <input type="text" placeholder='Please input' className=' focus:outline-none text-sm bg-gray-100 rounded-lg p-2' name='name' value={textMaterial.name} onChange={handleChange} />
                                </div>



                                <div className='flex flex-col gap-2 mt-8'>
                                    <label htmlFor="" className='font-semibold text-gray-700 text-sm'>Material Content</label>
                                    <textarea id="" className='bg-gray-100 rounded-lg p-2 text-sm focus:outline-none' rows={5} placeholder='Please input' name='content' value={textMaterial.content} onChange={handleChange}></textarea>
                                </div>



                                <button type='submit' className='bg-green-600 hover:bg-green-700 cursor-pointer rounded-lg px-4 py-2 text-white mt-6 float-right' onClick={handleSubmit}>Save</button>
                            </form>

                        </div>

                    </div>
                )}

                <div className='mt-8 flex gap-4 flex-wrap'>
                    {textReplys.map((reply, index) => (
                        <div key={index} className='bg-white rounded-lg p-4 max-w-[300px] min-h-[200px] w-full'>
                            <div className='flex items-center justify-between gap-4'>
                                <h4 className='truncate font-semibold text-green-600'>{reply.name}</h4>
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
                                        onClick={() => {handleDelete(index)}}
                                    >
                                        <img src={delete_icon} alt="delete" />
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4 text-sm'>
                                <p className='break-words'>{reply.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default TextReplyMaterial