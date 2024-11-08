import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const[userErrMessage, setUserErrMessage] = useState("");
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(`https://task1-fj98.onrender.com/api/v1/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData),
      });

      const dataFromServer = await response.json();

      console.log(dataFromServer);
      

      if(!dataFromServer.success) {
        setUserErrMessage(dataFromServer?.data?.userError);
        return;
      }

      if (dataFromServer?.data?.accessToken) {
        localStorage.setItem('accessToken', dataFromServer.data.accessToken);
      }

      navigate('/home');

    } catch (error) {
      console.log(error);
      throw new Error('Something went wrong while login');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 text-xs md:text-lg">
      { 
        loading &&
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-75 flex justify-center items-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div> 
      }

      <div className="bg-white p-10 rounded-lg shadow-md ">
        <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-5">Sign In</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-gray-700 font-semibold">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={loginData.username}
              onChange={handleInput}
              className="py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={loginData.password}
              onChange={handleInput}
              className="py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {userErrMessage?.length > 0 && <span className='text-red-500 text-xs pb-2 '>{userErrMessage}</span>}
          {userErrMessage?.length === 0 && <span className='pb-2'></span>}

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
