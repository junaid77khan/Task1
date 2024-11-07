import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const curUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                let response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/get-admin-name`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const jsonResponse = await response.json();

                if (jsonResponse.statusCode === 200) {
                    setAdminName(jsonResponse.data);
                } else {
                    console.error('Failed to fetch admin name');
                }
            } catch (error) {
                console.error('Error checking user status:', error);
            }
        };

        curUser();
    }, []);

    return (
        <div className='w-full shadow-lg bg-white'>
            <div className="max-w-screen-xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* First Section: Logo */}
                    <div className="flex items-center gap-8">
                        <img
                            src="https://play-lh.googleusercontent.com/DTzWtkxfnKwFO3ruybY1SKjJQnLYeuK3KmQmwV5OQ3dULr5iXxeEtzBLceultrKTIUTr"  // Replace with the actual logo path
                            alt="Logo"
                            className="w-12 h-12 rounded-full block md:block" // Show logo on large screens
                        />
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <ul className="hidden md:flex gap-8 font-semibold text-gray-700">
                            <li>
                                <NavLink
                                    to="/home"
                                    className={({ isActive }) =>
                                        `py-2 px-4 transition duration-200 ${isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-700 hover:text-blue-700"}` 
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/eList"
                                    className={({ isActive }) =>
                                        `py-2 px-4 transition duration-200 ${isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-700 hover:text-blue-700"}` 
                                    }
                                >
                                    Employee List
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center gap-8">
                        <ul className="hidden md:flex gap-8 font-semibold text-gray-700">
                            <li>
                                <NavLink
                                    to="#"
                                    className="py-2 px-4 text-gray-700 hover:text-blue-700"
                                >
                                    {adminName ? adminName : "Loading..."}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/logout"
                                    className={({ isActive }) =>
                                        `py-2 px-4 transition duration-200 ${isActive ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-700 hover:text-blue-700"}` 
                                    }
                                >
                                    Logout
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {isSidebarOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 md:hidden" onClick={() => setIsSidebarOpen(false)}>
                    <div className="w-64 bg-white h-full p-4 fixed left-0 top-0">
                        <ul className="space-y-4">
                            <li>
                                <NavLink
                                    to="/home"
                                    className="block py-2 px-4 text-gray-700 hover:text-blue-700"
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/eList"
                                    className="block py-2 px-4 text-gray-700 hover:text-blue-700"
                                >
                                    Employee List
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="#"
                                    className="block py-2 px-4 text-gray-700 hover:text-blue-700"
                                >
                                    {adminName ? adminName : "Loading..."}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/logout"
                                    className="block py-2 px-4 text-gray-700 hover:text-blue-700"
                                >
                                    Logout
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
