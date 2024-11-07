import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "./Header";

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/get-employees`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setEmployees(data?.employees || []);
                setTotalCount(data?.totalCount || 0);
            } catch (error) {
                console.error("Error fetching employee data", error);
            }
        };
    
        fetchEmployees();
    
        const intervalId = setInterval(fetchEmployees, 10000);
        return () => clearInterval(intervalId);
    }, []);

    const handleDelete = async (email) => {
        const token = localStorage.getItem('accessToken');
        const confirmation = window.confirm("Are you sure you want to delete this employee?");
        if (confirmation) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/delete-employee/${email}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    setEmployees(employees.filter(employee => employee.f_Id !== id));
                    setTotalCount(totalCount - 1);
                } else {
                    console.error("Failed to delete employee");
                }
            } catch (error) {
                console.error("Error deleting employee", error);
            }
        }
    };

    const handleEdit = (employee) => {
        navigate("/edit-emp", {
            state: { employee },
        });
    };

    return (
        <>
        <Header/>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4 sm:mb-0">
                    Employee List
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <span className="text-gray-600 text-sm sm:text-base">
                        Total Employees: {totalCount}
                    </span>
                    <NavLink to="/insert-edit-emp">
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4 sm:mt-0">
                            Create Employee
                        </button>
                    </NavLink>
                </div>
            </div>

            <div className="overflow-x-auto shadow-lg border-b border-gray-200 rounded-lg">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">ID</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Image</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Name</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Mobile</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Designation</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Gender</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Course</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Create Date</th>
                            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 ? (
                            employees.map((employee) => (
                                <tr key={employee.f_Id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 text-sm text-gray-600">{employee.f_Id}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600">
                                        <img src={employee.f_Image} alt="Employee" className="w-10 h-10 rounded-full" />
                                    </td>
                                    <td className="py-2 px-4 text-sm text-gray-600">{employee.f_Name}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600">{employee.f_Email}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600">{employee.f_Mobile}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600">{employee.f_Designation}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600">{employee.f_Gender}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600">{employee.f_Course}</td>
                                    <td className="py-2 px-4 text-sm text-gray-600">
                                        {new Date(employee.f_CreateDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 text-sm text-gray-600">
                                        <button
                                            onClick={() => handleEdit(employee)}
                                            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(employee.f_Email)} 
                                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-4 text-center text-gray-600">
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}

export default EmployeeList;
