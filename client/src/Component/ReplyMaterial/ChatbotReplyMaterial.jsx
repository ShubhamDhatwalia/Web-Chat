import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import { grey } from '@mui/material/colors';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { removeChatbot } from '../../redux/Chatbot/ChatbotSlice..js';
import { toast } from 'react-toastify';
import { addKeyword } from '../../redux/Keywords/keywordSlice.js';
import { updateKeyword } from '..//../redux/Keywords/keywordSlice.js'



function ChatbotReplyMaterial({ onClose, Keywords, selectedReplies, setSelectedReplies }) {



  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');


  const Chatbots = useSelector((state) => state.chatbot.Chatbots)

  const location = useLocation();
  const path = location.pathname;
  const { keywords } = useSelector((state) => state.keyword);


  const filteredChatbots = [...Chatbots].reverse().filter((chatbot) => {
    const search = searchTerm.toLowerCase();
    return (
      chatbot.name.toLowerCase().includes(search) ||
      chatbot.triggered.toString().includes(search) ||
      chatbot.finished.toString().includes(search) ||
      chatbot.lastUpdated.toString().includes(search)
    )
  });

  const handleTemplateAdd = () => {
    navigate("/chatbot");
  }


  const handleEdit = (chatbotId) => {
    navigate('/chatbot/flowbuilder', { state: { chatbotId } });
  };


  const handleDelete = (index) => {
    dispatch(removeChatbot(index));
    toast.success("Chatbot removed successfully!");
  };


  const handleFinalSubmit = () => {

    const updatedKeywords = {
      ...Keywords,
      replyMaterial: selectedReplies,
    };


    if (selectedReplies.length === 0) {
      toast.error("Please select at least one material")
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

        dispatch(addKeyword(updatedKeywords));
        toast.success("Keywords created successfully");
        onClose(true);

      }
    }


  };




  return (
    <>

      <div>
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
                  <span className='truncate inline-block overflow-hidden whitespace-nowrap text-ellipsis max-w-[70px] align-bottom'>
                    {reply.name || reply.currentReply.name}
                  </span>
                </div>
              ))}
            </div>
            )}



          </div>


          <div className='flex gap-4'>
            {path == '/keywordAction' && (<>
              <button type='button ' className='bg-red-50 border border-red-600 cursor-pointer text-red-600  px-4 py-1 rounded-md hover:bg-red-100 transition duration-200' onClick={onClose} >
                Cancel
              </button>
              <button type='button ' className='bg-green-50 border border-green-600 cursor-pointer text-green-600  px-4 py-1 rounded-md hover:bg-green-100 transition duration-200' onClick={handleFinalSubmit} >
                Save
              </button></>)}
            <button type='button ' className='bg-green-600 cursor-pointer text-white  px-4 py-2 rounded-md hover:bg-green-700 transition duration-200' onClick={handleTemplateAdd}>
              Add
            </button>
          </div>
        </div>
      </div>




      <div className='mt-6 px-4'>
        <div className='p-4 bg-white rounded-lg min-h-[70vh] overflow-auto text-gray-600'>
          <table className='table-auto w-full   '>
            <thead className='text-md '>
              <tr className="sticky top-0 z-10 border-b border-gray-300 bg-white text-center text-nowrap">
                <th className="py-6 pr-22 text-left font-semibold">Name</th>
                <th className='py-6 pr-22 text-center font-semibold'>Triggered</th>
                <th className='py-6 pr-22 text-center font-semibold'>Finished</th>
                <th className='py-6 pr-22 text-center font-semibold'>Last Updated</th>
                <th className='py-6 text-right font-semibold'>Actions</th>
              </tr>
            </thead>

            <tbody className=' font-semibold '>
              {filteredChatbots.length > 0 ? (
                filteredChatbots.map((chatbot, index) => (
                  <tr key={index} className=' text-center '>
                    <td className='px-[0px] py-4 text-left text-blue-600 flex gap-2 items-center'>
                      {path === '/keywordAction' && (
                        <Checkbox
                          color="success"
                          checked={selectedReplies.some(item => item.currentReply?.name === chatbot.name)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentReply = chatbot;
                            const replyType = 'Chatbot';

                            if (isChecked) {
                              setSelectedReplies(prev => [...prev, { replyType, currentReply }]);

                            } else {
                              setSelectedReplies(prev => prev.filter(item => item.currentReply?.name !== currentReply.name));
                            }
                          }}

                          sx={{
                            padding: 0,
                            '& svg': {
                              fontSize: 28,
                            },
                            color: grey[500],
                          }}
                        />

                      )}
                      <div className='cursor-pointer hover:underline' onClick={() => handleEdit(chatbot.id)}>{chatbot.name}</div>
                    </td>

                    <td className='py-4 pr-22'>{chatbot.triggered}</td>
                    <td className='py-4 pr-22'>{chatbot.finished}</td>
                    <td className='py-4 pr-22'>
                      {chatbot.lastUpdated
                        ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', }).format(new Date(chatbot.lastUpdated))
                        : 'N/A'}
                    </td>




                    <td className='py-4 text-right'>
                      <div className='flex gap-4 justify-end'>
                        <i className="fa-solid fa-pen-to-square bg-gray-100 p-2 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-100 cursor-pointer" onClick={() => handleEdit(chatbot.id)} ></i>
                        <i className="fa-solid fa-trash bg-gray-100 p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-100 cursor-pointer" onClick={() => handleDelete(index)}></i>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className='py-10 text-center text-gray-500'>
                    No Chatbot found.
                  </td>
                </tr>
              )}



            </tbody>


          </table>
        </div>
      </div>
    </>
  )
}

export default ChatbotReplyMaterial