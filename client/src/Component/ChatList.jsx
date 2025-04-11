import React from 'react';

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

function ChatList() {
  return (
    <ul>
      {chatData.map((chat) => (
        <li
          key={chat.id}
          className='  '
        >
          <div className='flex justify-between items-stretch h-[55px]  cursor-pointer hover:bg-blue-100'>
            <div className='flex items-center flex-grow '>
              <i className="fa-solid fa-circle-user text-gray-500 text-4xl"></i>

              <div className='ml-[10px] flex flex-col justify-center border-b border-gray-300 w-full h-full'>
                <h2 className='UserName font-bold'>{chat.name}</h2>
                {chat.message && (
                  <p className='text-gray-500 font-semibold text-sm'>{chat.message}</p>
                )}
              </div>
            </div>

            <div className='border-b border-gray-300  pl-2 whitespace-nowrap'>
              <p className='timeStamp text-gray-500 text-xs font-semibold'>{chat.time}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ChatList;
