import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                const logoutResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/logout`, {
                    method: 'GET',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Add token to Authorization header
                    },
                });

                const jsonResponse = await logoutResponse.json();  // Convert the response to JSON

                if (jsonResponse.success) {
                    console.log("Logout successful");
                    localStorage.removeItem('accessToken');  
                } else {
                    console.error('Error during logout');
                }
            } catch (error) {
                console.error('Error during logout:', error);
            }
            navigate("/");
        };

        handleLogout();
    }, [navigate]); 
    return (
        <>
            <Header />
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-75 flex justify-center items-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        </>
    );
}

export default Logout;
