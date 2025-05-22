import React, { use, useEffect } from 'react';
import profile_icon from '../../assets/profile_icon.svg';
import { useDispatch, useSelector } from 'react-redux';


const conversation = [
  {
    message: 'Plan A',
    time: '03:30 PM',
    phone: '+917876054918',
  },
  {

    message: 'Stop promotions',
    time: '12:52 PM',
    phone: '+917876054920',
  },
  {

    message: 'A',
    time: '12:33 PM',
    phone: '+917876054919',
  },
]





function ChatList({ onSelectUser, selectedUser }) {
  const contacts = useSelector((state) => state.contact.contacts);


  const chatData = conversation.map((chat) => {
    const contact = contacts.find((contact) => contact.phone === chat.phone);
    return {
      ...chat,
      name: contact ? contact.name : 'Unknown',
      id: contact ? contact.id : 'Unknown',
    };
  });


  console.log(chatData[0]);




  useEffect(() => {
    if (!selectedUser && chatData.length > 0) {
      onSelectUser(chatData[0]);
    }
  }, [selectedUser, chatData, onSelectUser]);



  return (
    <ul>
      {chatData.map((chat) => (
        <li
          key={chat.id}
          onClick={() => onSelectUser(chat)}
          className={`cursor-pointer hover:bg-green-50 px-2 ${selectedUser?.phone === chat.phone ? 'bg-green-100' : ''
            }`}
        >
          <div className='flex justify-between items-stretch h-[70px]'>
            <div className='flex items-center flex-grow'>
              <img src={profile_icon} alt="" />
              <div className='ml-[10px] flex flex-col justify-center border-b border-gray-300 w-full h-full'>
                <h2 className='UserName font-semibold'>{chat.name}</h2>
                {chat.message && (
                  <p className='text-gray-500 font-semibold text-xs'>{chat.message}</p>
                )}
              </div>
            </div>
            <div className='border-b border-gray-300 pl-2 whitespace-nowrap flex items-end'>
              <p className='timeStamp text-gray-500 text-xs font-semibold mr-2'>{chat.time}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}


export default ChatList;
