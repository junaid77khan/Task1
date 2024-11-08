import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";

function EditEmployee() {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee } = location.state || {};  

  const [employeeData, setEmployeeData] = useState({
    f_Id: employee?._id || "",
    f_Image: employee?.f_Image || "",
    f_Name: employee?.f_Name || "",
    f_Email: employee?.f_Email || "",
    f_Mobile: employee?.f_Mobile || "",
    f_Designation: employee?.f_Designation || "",
    f_Gender: employee?.f_Gender || "",
    f_Course: employee?.f_Course || "",
  });

  const [errors, setErrors] = useState({
    f_Mobile: "",
    f_Email: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "f_Mobile") {
      if (!/^\d{10}$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          f_Mobile: "Mobile number must be 10 digits and numeric",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          f_Mobile: "",
        }));
      }
    }

    if (name === "f_Email") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,}$/;
      if (!emailPattern.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          f_Email: "Please enter a valid email address",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          f_Email: "",
        }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEmployeeData((prevState) => ({
      ...prevState,
      f_Image: file,
    }));
  };

  const handleImageCancel = () => {
    setEmployeeData((prevState) => ({
      ...prevState,
      f_Image: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.f_Mobile || errors.f_Email) {
      alert("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      Object.keys(employeeData).forEach((key) => {
        formData.append(key, employeeData[key]);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/edit-employee`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate("/elist");
      } else {
        alert("Failed to update employee");
      }
    } catch (error) {
      console.error("Error editing employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/elist");
  };

  const imagePreviewUrl = employeeData.f_Image
    ? (employeeData.f_Image instanceof File ? URL.createObjectURL(employeeData.f_Image) : employeeData.f_Image)
    : employee?.f_Image;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-75 flex justify-center items-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">Edit Employee</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="f_Name">
                Name
              </label>
              <input
                type="text"
                id="f_Name"
                name="f_Name"
                value={employeeData.f_Name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="f_Email">
                Email
              </label>
              <input
                type="email"
                id="f_Email"
                name="f_Email"
                value={employeeData.f_Email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.f_Email && <p className="text-red-500 text-sm">{errors.f_Email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="f_Mobile">
                Mobile
              </label>
              <input
                type="tel"
                id="f_Mobile"
                name="f_Mobile"
                value={employeeData.f_Mobile}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.f_Mobile && <p className="text-red-500 text-sm">{errors.f_Mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="f_Designation">
                Designation
              </label>
              <select
                id="f_Designation"
                name="f_Designation"
                value={employeeData.f_Designation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Designation</option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="f_Gender">
                Gender
              </label>
              <select
                id="f_Gender"
                name="f_Gender"
                value={employeeData.f_Gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="f_Course">
                Course
              </label>
              <select
                id="f_Course"
                name="f_Course"
                value={employeeData.f_Course}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Course</option>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
                <option value="BSC">BSC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600" htmlFor="f_Image">
                Image (Optional)
              </label>
              <input
                type="file"
                id="f_Image"
                name="f_Image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreviewUrl && (
                <div className="mt-2">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleImageCancel}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white ${loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"} `}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditEmployee;
