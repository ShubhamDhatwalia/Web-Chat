import React, { useEffect, useRef, useState } from 'react';
import { FaComments, FaPhoneAlt } from 'react-icons/fa';
import ChatList from "../Chat/ChatList.jsx";
import profile_icon from '../../assets/profile_icon.svg'
import EmojiPicker from 'emoji-picker-react';
import Templates from '../Chat/Templates.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserProfileDetails from '../Chat/UserProfileDetails.jsx';


function Chat() {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [showTemplates, setShowTemplates] = useState(false);

  const modalRef = useRef(null);


  const tabs = [
    { id: 'chats', label: 'Chats', icon: <FaComments /> },
    { id: 'calls', label: 'Calls', icon: <FaPhoneAlt /> },
  ];


  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };


  const textareaRef = useRef(null);
  const maxHeight = 150;

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';

    setMessage(textarea.value);
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);



  const handleTemplates = () => {

    setShowTemplates((prev) => !prev);
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (message.trim() === '') return;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: selectedUser.phone,
      type: "text",
      text: {
        preview_url: true,
        body: message,
      }
    };


    console.log(payload);

    try {
      await axios.post(`/sendTextMessage`, payload);
      toast.success("Message sent successfully");
    } catch (error) {
      console.error(error);
    }

  }





  return (
    <div className='bg-gray-100 h-[calc(100vh-60px)] w-full'>
      <div className='bg-white rounded-md flex'>
        <div className='flex-[15%] border-r border-gray-300'>
          <div className='flex items-center gap-[10px] px-2 mt-3'>
            <form className='flex-grow'>
              <input
                type="text"
                className='border border-gray-400 rounded-sm w-full px-[10px] py-[5px] text-sm focus:outline-none'
                placeholder='Search by any Keyword, Name, Phone'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <div className='bg-gray-200 flex items-center justify-center p-[5px] border border-gray-400 rounded-sm cursor-pointer'>
              <i className="fa-solid fa-gear text-2xl"></i>
            </div>
          </div>

          <div className='mt-[30px]'>
            <div className="flex px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-t-sm bg-gray-100 flex-1 ${activeTab === tab.id
                    ? 'border-gray-400 border-b-0 rounded-b-[-5px] bg-white text-blue-600 font-semibold'
                    : 'border border-gray-400 text-black hover:text-blue-500'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chat list */}
            <div className="mt-[15px]">
              {activeTab === 'chats' && (
                <div className='h-[calc(100vh-195px)] overflow-y-auto'>
                  <ChatList onSelectUser={setSelectedUser} selectedUser={selectedUser} onSearch={searchTerm} />
                </div>
              )}
              {activeTab === 'calls' && <div className='h-[77vh] overflow-y-auto'>Calls content here</div>}
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className='flex-[50%] '>
          <div className='bg-[url("./assets/whatsapp-bg.jpg")] bg-no-repeat bg-center bg-cover opacity-70 w-full h-full relative'>
            {selectedUser ? (
              <>
                {/* Chat header */}
                <div className='bg-gray-100 px-[20px] py-[10px] flex items-center gap-[10px]'>
                  <img src={profile_icon} alt="" />
                  <div>
                    <h2 className='text-md font-bold'>{selectedUser.name}</h2>
                    {/* <p className='text-gray-500 text-sm font-semibold'> {selectedUser.name}</p> */}
                  </div>
                </div>

                {/* Chat messages would go here */}
                <div className="p-4 text-gray-700">Start chatting with {selectedUser.name}...</div>


                {/* Footer */}
                <div className='chat-footer flex items-center gap-[20px] bg-white px-[20px] py-[10px] absolute bottom-0 w-full'>
                  <div className='flex items-center gap-[15px]'>


                    <div className='bg-gray-100 hover:bg-green-200 rounded-full cursor-pointer p-2' onClick={handleTemplates}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.6667 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V7.5C2.5 7.96024 2.8731 8.33333 3.33333 8.33333H16.6667C17.1269 8.33333 17.5 7.96024 17.5 7.5V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5Z" stroke="#353735" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.5 11.6667H3.33333C2.8731 11.6667 2.5 12.0398 2.5 12.5V16.6667C2.5 17.1269 2.8731 17.5 3.33333 17.5H7.5C7.96024 17.5 8.33333 17.1269 8.33333 16.6667V12.5C8.33333 12.0398 7.96024 11.6667 7.5 11.6667Z" stroke="#353735" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.6667 11.6667H12.5C12.0398 11.6667 11.6667 12.0398 11.6667 12.5V16.6667C11.6667 17.1269 12.0398 17.5 12.5 17.5H16.6667C17.1269 17.5 17.5 17.1269 17.5 16.6667V12.5C17.5 12.0398 17.1269 11.6667 16.6667 11.6667Z" stroke="#353735" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>

                    <div className='bg-gray-100 rounded-full hover:bg-green-200 cursor-pointer p-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21" fill="none"><path d="M14.0116 2.18213C12.8324 2.18213 11.6533 2.62963 10.7572 3.52572L2.34978 11.9331C2.2898 11.9907 2.24191 12.0597 2.20892 12.136C2.17593 12.2123 2.1585 12.2945 2.15766 12.3776C2.15681 12.4608 2.17256 12.5433 2.20399 12.6202C2.23543 12.6972 2.2819 12.7672 2.3407 12.826C2.3995 12.8848 2.46944 12.9312 2.54642 12.9627C2.62341 12.9941 2.70589 13.0099 2.78904 13.009C2.87219 13.0082 2.95434 12.9907 3.03067 12.9578C3.107 12.9248 3.17598 12.8769 3.23357 12.8169L11.641 4.40951C12.9555 3.095 15.0677 3.095 16.3822 4.40951C17.6967 5.72401 17.6967 7.83621 16.3822 9.15072L8.4476 17.0853C7.76606 17.7668 6.67959 17.7668 5.99805 17.0853C5.31651 16.4037 5.31651 15.3173 5.99805 14.6357L12.4002 8.23356C12.4602 8.17597 12.5081 8.10699 12.5411 8.03066C12.5741 7.95433 12.5915 7.87218 12.5924 7.78904C12.5932 7.70589 12.5774 7.6234 12.546 7.54642C12.5146 7.46943 12.4681 7.39949 12.4093 7.34069C12.3505 7.2819 12.2806 7.23542 12.2036 7.20399C12.1266 7.17256 12.0441 7.15681 11.961 7.15765C11.8778 7.1585 11.7957 7.17592 11.7193 7.20891C11.643 7.2419 11.574 7.28979 11.5164 7.34977L5.11426 13.752C3.95497 14.9112 3.95497 16.8098 5.11426 17.9691C6.27356 19.1284 8.17209 19.1284 9.33139 17.9691L17.266 10.0345C19.0581 8.24234 19.0581 5.31788 17.266 3.52572C16.3699 2.62963 15.1907 2.18213 14.0116 2.18213Z" fill="#353735"></path></svg>
                    </div>

                    <div className='bg-gray-100 hover:bg-green-200 rounded-full cursor-pointer p-2 emoji' onClick={handleToggleEmojiPicker}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.49999 16.2083C12.7572 16.2083 16.2083 12.7572 16.2083 8.49996C16.2083 4.24276 12.7572 0.791626 8.49999 0.791626C4.24279 0.791626 0.791656 4.24276 0.791656 8.49996C0.791656 12.7572 4.24279 16.2083 8.49999 16.2083Z" stroke="#353735" stroke-width="1.25" stroke-miterlimit="10"></path><path d="M6.62498 5.79163H4.95831" stroke="#353735" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M12.0417 5.79163H10.375" stroke="#353735" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round"></path><path d="M12.0416 9.125C12.0416 11.0808 10.4558 12.875 8.49998 12.875C6.54415 12.875 4.95831 11.0808 4.95831 9.125C6.62498 9.125 9.95831 9.125 12.0416 9.125Z" stroke="#353735" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                  </div>
                  <form className='flex-grow flex items-center'>
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={message}
                      onChange={handleInput}
                      className='bg-gray-100 p-[10px] w-full h-full rounded-2xl focus:outline-none resize-none overflow-hidden'
                      placeholder='Type a message'
                    ></textarea>
                  </form>
                  <div className='bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600' onClick={(e) => handleSubmit(e)}>
                    <i className="fa-regular fa-paper-plane p-[10px] text-xl text-white"></i>
                  </div>


                  {showTemplates && (
                    <>
                      <div className="absolute bottom-[0px] left-[0px] right-0 z-10 p-4 bg-white rounded-md shadow-lg">

                        <Templates onClose={(setShowTemplates)} selectedUser={selectedUser} />

                      </div>
                    </>
                  )}


                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div ref={modalRef} className="absolute bottom-[62px] left-[0px] z-10">
                      <EmojiPicker onEmojiClick={handleEmojiClick} previewConfig={{ showPreview: false }} skinTonesDisabled={true} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className='flex items-center justify-center h-full text-gray-600 font-medium'>
                Click on a user to start chatting.
              </div>
            )}
          </div>
        </div>


        <div className='flex-[10%] border-l border-gray-300 p-4'>
          <UserProfileDetails selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
