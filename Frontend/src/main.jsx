import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './Components/Login.jsx'
import Home from './Components/Home.jsx'
import Logout from './Components/Logout.jsx'
import EmployeeList from './Components/Emp_List.jsx'
import Insert_Add_Emp from './Components/Insert_Add_Emp.jsx'
import EditEmployee from './Components/Edit_Emp.jsx'

const router = createBrowserRouter(
   createRoutesFromElements(

    <Route  path='/' element={<App />}>
       <Route path='' element={<Login/>} />
       <Route path='home' element={<Home/>} />
       <Route path='logout' element={<Logout/>} />
       <Route path='eList' element={<EmployeeList/>} />
       <Route path='insert-edit-emp' element={<Insert_Add_Emp/>} />
       <Route path='edit-emp' element={<EditEmployee/>} />
    </Route>
   )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
