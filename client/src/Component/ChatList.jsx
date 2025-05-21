import React, { use, useEffect } from 'react';
import profile_icon from '../assets/profile_icon.svg'

const chatData = [
  {
    id: 1,
    name: 'Thakur',
    message: 'Plan A',
    time: '03:30 PM',
  },
  {
    id: 2,
    name: 'Mandy',
    message: 'Stop promotions',
    time: '12:52 PM',
  },
  {
    id: 3,
    name: 'Seoliy',
    message: 'A',
    time: '12:33 PM',
  },
  {
    id: 4,
    name: '919654297000',
    message: '',
    time: '01:45 PM',
  },
  {
    id: 5,
    name: 'Thakur',
    message: 'Plan A',
    time: '03:30 PM',
  },
  {
    id: 6,
    name: 'Mandy',
    message: 'Stop promotions',
    time: '12:52 PM',
  },
  {
    id: 7,
    name: 'Seoliy',
    message: 'A',
    time: '12:33 PM',
  },
  {
    id: 8,
    name: '919654297000',
    message: '',
    time: '01:45 PM',
  },
  {
    id: 9,
    name: 'Thakur',
    message: 'Plan A',
    time: '03:30 PM',
  },
  {
    id: 10,
    name: 'Mandy',
    message: 'Stop promotions',
    time: '12:52 PM',
  },
  {
    id: 11,
    name: 'Seoliy',
    message: 'A',
    time: '12:33 PM',
  },
  {
    id: 12,
    name: '919654297000',
    message: '',
    time: '01:45 PM',
  },
  {
    id: 13,
    name: 'Thakur',
    message: 'Plan A',
    time: '03:30 PM',
  },
  {
    id: 14,
    name: 'Mandy',
    message: 'Stop promotions',
    time: '12:52 PM',
  },
  {
    id: 15,
    name: 'Seoliy',
    message: 'A',
    time: '12:33 PM',
  },
  {
    id: 16,
    name: '919654297000',
    message: '',
    time: '01:45 PM',
  },
];

function ChatList({ onSelectUser, selectedUser }) {
  console.log(onSelectUser);
  console.log(selectedUser);

  useEffect(() => {
    if (!selectedUser) {
      onSelectUser(chatData[0]);
    }
  }, [selectedUser]);



  return (
    <ul>
      {chatData.map((chat) => (
        <li
          key={chat.id}
          onClick={() => onSelectUser(chat)}
          className='cursor-pointer hover:bg-green-50 px-2 '
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
