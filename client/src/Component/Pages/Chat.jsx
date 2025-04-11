import React from 'react'
import { useState } from 'react';
import { FaComments, FaPhoneAlt, FaAddressBook } from 'react-icons/fa';
import ChatList from "../ChatList.jsx";





function Chat() {

  const [activeTab, setActiveTab] = useState('chats');

  const tabs = [
    { id: 'chats', label: 'Chats', icon: <FaComments /> },
    { id: 'calls', label: 'Calls', icon: <FaPhoneAlt /> },
    { id: 'contacts', label: 'Contacts', icon: <FaAddressBook /> },
  ];

  return (
    <>

      <div className='bg-gray-100 p-[5px]  w-full'>

        <div className='bg-white p-[5px] rounded-md flex'>

          <div className='flex-[30%] p-[5px] border-r border-gray-300'>

            <div className=' flex items-center gap-[10px]'>
              <form className='flex-grow'>
                <input
                  type="text"
                  className='border border-gray-400 rounded-sm w-full px-[10px] py-[5px] focus:outline-none'
                  placeholder='Search by any Keyword, Name, Phone'
                />
              </form>

              <div className='bg-gray-200 flex items-center justify-center p-[5px] border border-gray-400 rounded-sm cursor-pointer'>
                <i className="fa-solid fa-gear text-2xl"></i>
              </div>
            </div>



            <div className='mt-[30px]'>

              <div className="flex ">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-t-sm bg-gray-100 flex-1 ${activeTab === tab.id
                      ? 'border-gray-400 border-b-0 rounded-b-[-5px] bg-white  text-blue-600 font-semibold'
                      : 'border border-gray-400 text-black hover:text-blue-500'
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-[15px]">
                {activeTab === 'chats' && <div className='h-[77vh] overflow-y-auto'>

                  <ChatList />

                </div>}
                {activeTab === 'calls' && <div className='h-[77vh] overflow-y-auto' >Calls content here</div>}
                {activeTab === 'contacts' && <div className='h-[77vh] overflow-y-auto'>Contacts content here</div>}
              </div>

            </div>




          </div>


          <div className='flex-[60%] px-[5px] '>


            <div className='bg-[url("./assets/whatsapp-bg.jpg")] bg-no-repeat bg-center bg-cover opacity-70 w-full h-full relative '>

              <div className=' bg-gray-100 px-[20px] py-[5px] flex items-center gap-[10px] '>
                <i className="fa-brands fa-square-whatsapp text-4xl text-green-600"></i>

                <div>
                  <h2 className='text-md font-bold'>Web Chat</h2>
                  <p className='text-gray-500 text-sm font-semibold'>click on web app user</p>
                </div>
              </div>




              <div className='chat-footer  flex gap-[20px] bg-gray-100 px-[20px] py-[10px] absolute bottom-0 w-full'>

                <div className='flex items-center gap-[20px]  '>
                  <div className='bg-white rounded-full hover:bg-blue-200 cursor-pointer'>
                    <i className="fa-solid fa-paperclip p-[10px] text-xl"></i>
                  </div>

                  <div className='bg-white hover:bg-blue-200 rounded-full cursor-pointer '>
                    <i className="fa-solid fa-images p-[10px] text-xl"></i>
                  </div>

                  <div className='bg-white hover:bg-blue-200 rounded-full cursor-pointer '>
                    <i className="fa-solid fa-rotate-left p-[10px] text-xl"></i>
                  </div>

                </div>


                <form className=' flex-grow '>
                  <input type="text" className='bg-white px-[10px] w-full h-full rounded-2xl focus:outline-none' placeholder='Type a message' />
                </form>

                <div className='bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600'>
                  <i className="fa-regular fa-paper-plane p-[10px] text-xl text-white"></i>
                </div>

              </div>

            </div>



          </div>

        </div>




      </div>
    </>
  )
}

export default Chat