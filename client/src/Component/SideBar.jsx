import React from 'react';

import { NavLink } from 'react-router-dom';



function SideBar({ isOpen, toggleSidebar }) {




    return (
        <>


            <div className={`bg-black h-[100vh]  ${isOpen ? 'w-[250px] ' : 'w-[60px]'} overflow-hidden transition-all duration-500 ease-in-out text-nowrap`}>
                <header className='flex items-center justify-between border-b-2 border-r-2 border-gray-700  py-[10px] px-[20px] h-[60px]'>

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
                                `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'
                                }`
                            }
                        >
                            <i className="fa-solid fa-house"></i> <span>Home</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/chats"
                            className={({ isActive }) =>
                                `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'
                                }`
                            }
                        >
                            <i className="fa-solid fa-message"></i> <span>Chats</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/broadCast"
                            className={({ isActive }) =>
                                `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'
                                }`
                            }
                        >
                            <i className="fa-solid fa-tower-broadcast"></i> <span>BroadCast</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/manageTemplates"
                            className={({ isActive }) =>
                                `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'
                                }`
                            }
                        >
                            <i className="fa-solid fa-briefcase"></i> <span>Manage Templates</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/automation"
                            className={({ isActive }) =>
                                `flex items-center gap-2 transition-colors duration-200 ${isActive ? 'text-amber-600 font-semibold' : 'text-white hover:text-amber-600'
                                }`
                            }
                        >
                            <i className="fa-solid fa-gear"></i> <span>Automation</span>
                        </NavLink>
                    </li>
                </ul>


            </div>

        </>
    )
}

export default SideBar