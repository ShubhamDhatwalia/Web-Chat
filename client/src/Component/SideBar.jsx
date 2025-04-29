import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function SideBar({ isOpen, toggleSidebar }) {
    const [isAutomationOpen, setAutomationOpen] = useState(false);

    const toggleAutomationDropdown = () => {
        setAutomationOpen(prev => !prev);
    };

    return (
        <div className={`bg-black h-[100vh] ${isOpen ? 'w-[250px]' : 'w-[60px]'} overflow-hidden transition-all duration-500 ease-in-out text-nowrap`}>
            <header className='flex items-center justify-between border-b-2 border-r-2 border-gray-700 py-[10px] px-[20px] h-[60px]'>
                <a href="#">
                    <div className={`logo text-white font-bold text-2xl ${isOpen ? 'visible' : 'hidden'}`}>Web <span className='text-amber-600'>Chat</span></div>
                </a>
                <i className="fa-solid fa-bars text-white text-2xl cursor-pointer" onClick={toggleSidebar}></i>
            </header>

            <ul className='side-bar-menu text-white mt-[50px] py-[10px] px-[20px] flex flex-col gap-[20px]'>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'}`
                        }
                    >
                        <i className="fa-solid fa-house"></i> <span>Home</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/chats"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'}`
                        }
                    >
                        <i className="fa-solid fa-message"></i> <span>Chats</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/broadCast"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'}`
                        }
                    >
                        <i className="fa-solid fa-tower-broadcast"></i> <span>BroadCast</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/manageTemplates"
                        className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'}`
                        }
                    >
                        <i className="fa-solid fa-briefcase"></i> <span>Manage Templates</span>
                    </NavLink>
                </li>

                <li>
                    <div
                        onClick={toggleAutomationDropdown}
                        className="flex items-center justify-between cursor-pointer gap-2 hover:text-amber-600 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-gear"></i> <span className='ml-[10px]'>Automation</span>
                        </div>
                        <i className={`fa-solid fa-chevron-${isAutomationOpen ? 'up' : 'down'}`}></i>
                    </div>

                    {/* Dropdown items */}
                    {isAutomationOpen && (
                        <ul className='ml-8 mt-4 flex flex-col gap-4 text-sm'>
                            <li>
                                <NavLink to="/keywordAction" className={({ isActive }) =>
                                    `${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'}`
                                }>
                                    <i class="fa-solid fa-gears"></i>
                                    <span>Keyword Action</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/replyMaterial" className={({ isActive }) =>
                                    `${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'}`
                                }>
                                    <i class="fa-solid fa-reply"></i>
                                    <span>Reply Material</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/chatbot" className={({ isActive }) =>
                                    `${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'}`
                                }>

                                    <i class="fa-regular fa-message"></i>
                                    <span>Chatbots</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/rules" className={({ isActive }) =>
                                    `${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'}`
                                }>

                                    <i class="fa-solid fa-layer-group"></i>
                                    <span>Rules</span>
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
}

export default SideBar;
