import React, { useState } from 'react'

function Sidebar() {
    const [activeItem, setActiveItem] = useState('Text')

    const items = [
        { label: 'Text', icon: 'fa-regular fa-pen-to-square' },
        { label: 'Document', icon: 'fa-solid fa-file' },
        { label: 'Image', icon: 'fa-regular fa-image' },
        { label: 'Video', icon: 'fa-solid fa-file-video' },
        { label: 'Stickers', icon: 'fa-solid fa-note-sticky' },
        { label: 'Chatbots', icon: 'fa-regular fa-message' },
        { label: 'Sequences', icon: 'fa-solid fa-layer-group' },
        { label: 'Contact Attributes', icon: 'fa-solid fa-id-badge' },
        { label: 'Templates', icon: 'fa-solid fa-table-columns' }
    ]

    return (
        <div className='bg-gray-100 px-6 rounded-tl-lg rounded-bl-lg'>
            <ul className='flex flex-col gap-4 font-semibold text-gray-600'>
                {items.map((item, index) => (
                    <li
                        key={index}
                        onClick={() => setActiveItem(item.label)}
                        className={`flex items-center cursor-pointer gap-6 
                            ${index !== items.length - 1 ? 'border-b border-gray-300' : ''} 
                            ${activeItem === item.label ? 'text-amber-600' : 'hover:text-amber-600'} 
                            ${index === 0 ? 'py-4' : 'pb-4'}
                        `}
                    >
                        <div className='w-[18px] h-[18px] flex items-center'>
                            <i className={`${item.icon} text-[18px]`}></i>
                        </div>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar
