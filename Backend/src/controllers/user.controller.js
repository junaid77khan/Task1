import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Admin } from "../models/user.model.js";
import { destroyOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose, { Schema, Types } from "mongoose";
import bcryptjs from 'bcryptjs';
import { Employee } from "../models/employee.model.js";

const generateAccessAndRefreshTken = async (userId) => {
  
    try {
        const user = await Admin.findById(new mongoose.Types.ObjectId(userId));
    
        if (!user) {
          throw new ApiError(404, "User not found");
        }
    
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
    
        return { accessToken, refreshToken };
      } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while generating Refresh and Access token");
      }
}

const adminSignup = asyncHandler( async(req, res) => {
    let {username, password} = req.body;

    const validation = signUpSchema.safeParse(req.body);

    if(!validation.success) {
        const usernameErrors = validation.error.format().username?._errors || [];
        const emailErrors = validation.error.format().email?._errors || [];
        const passwordErrors = validation.error.format().password?._errors || [];

        return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                {
                    "usernameError": `${usernameErrors?.length > 0 ? `${usernameErrors[0]}` : ""}`,
                    "emailError": `${emailErrors?.length > 0 ? `${emailErrors[0]}` : ""}`,
                    "passwordError": `${passwordErrors?.length > 0 ? `${passwordErrors[0]}` : ""}`,
                },
            )
        )
    }

        
        if(
            [username, password].some( (field) => field?.trim === "" )
        ) {
    
            return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {
                        "usernameError": `${username?.trim === "" ? "Username is required" : ""}`,
                        "emailError": `${email?.trim === "" ? "Email is required" : ""}`,
                        "passwordError": `${password?.trim === "" ? "Password is required" : ""}`,
                    },
                )
            )
        }

    
    username = username.toLowerCase();

    const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
    
        await Admin.create({
            username,
            password,
        })

    const user = await Admin.find({username})

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully, Please verify your account"));
} )

const adminLogin = asyncHandler(async(req, res) => {
    let{username, password} = req.body;

    if(!username) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {
                        "usernameError": `Username is required`,
                    },
                )
            )
    }

    if(!password) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {
                        "usernameError": `Passowrd is required`,
                    },
                )
            )
    }

    let user = await Admin.findOne(
        {"username": username}
    );

    if(!user) {
        return res
        .status(400)
        .json(
            new ApiResponse(
                400,
                {
                    "emailError": "User not found",
                },
            )
        )
    }
    
    
    const isPasswordValid = await bcryptjs.compare(password, user.password)

    if(!isPasswordValid) {
        return res
            .status(400)
            .json(
                new ApiResponse(
                    400,
                    {
                        "emailError": "Credentials are wrong"
                    },
                )
            )
        
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTken(user._id)

    const loggedInUser = await Admin.findById(user._id)
    .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: false,  
        expires: new Date(Date.now() + 25892000000),
        sameSite: 'none',
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, refreshToken, accessToken
            },
            "User logged in successfully"
        )
    )
})

const logout = asyncHandler( async(req, res) => {
    const user = await Admin.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken:1 //this removes a field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200, user, "User logout succesfully"
        )
    )
} )

const refreshAccessToken = asyncHandler( async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await Admin.findById(decodedToken._id)
    
        if(!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(user?.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or used")
        }
    
        const{accessToken, newRefreshToken} = await generateAccessAndRefreshTken(user._id)
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse( 
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Refresh token is refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token")
    }

} )

const getCurrentUser = asyncHandler( async(req, res) => {        
    return res
    .status(200)
    .json(new ApiResponse(200, {"User": req.user}, "Current user fetched succesfully"))
} )

const createEmployee = async (req, res) => {
    const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course } = req.body;

    const f_Image = req.file?.path;

    if (!f_Name || !f_Email || !f_Mobile || !f_Designation || !f_Gender || !f_Course) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const employeeExists = await Employee.findOne({ 
        $or: [{ f_Email }, { f_Mobile }]
    });

    if (employeeExists) {
        return res.status(400).json({ message: "Employee with this email already exists" });
    }

    const cloudinaryResponse = await uploadOnCloudinary(f_Image);   
    
    console.log(cloudinaryResponse);
    
    const f_Id = new Types.ObjectId();
    const employee = new Employee({
        f_Id,
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_Gender,
        f_Course,
        f_Image: cloudinaryResponse.url
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
    } catch (error) {
        res.status(500).json({ message: "Error creating employee", error: error.message });
    }
};

const getEmployees = async (req, res) => {
    try {
        // Fetch all employees
        const employees = await Employee.find().sort({ createdAt: -1 });
        const totalCount = await Employee.countDocuments();

        res.status(200).json({
            employees: employees.map(employee => ({
                f_Id: employee._id.toString().slice(-5),
                f_Name: employee.f_Name,
                f_Email: employee.f_Email,
                f_Mobile: employee.f_Mobile,
                f_Designation: employee.f_Designation,
                f_Gender: employee.f_Gender,
                f_Course: employee.f_Course,
                f_Image: employee.f_Image,
                f_CreateDate: employee.createdAt
            })),
            totalCount
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Error fetching employees" });
    }
};

const editEmployee = async (req, res) => {
    const {
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_Gender,
        f_Course,
    } = req.body;

    try {
        const employee = await Employee.findOne({ f_Email });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        let cloud_url = employee.f_Image;

        if (req.file) {
            const imageFile = req.file.path;

            if (employee.f_Image) {
                await destroyOnCloudinary(employee.f_Image);
            }

            const uploadResponse = await uploadOnCloudinary(imageFile);
            cloud_url = uploadResponse.secure_url;
        }

        const updatedEmployee = await Employee.findOneAndUpdate(
            { f_Email },
            {
                $set: {
                    f_Name: f_Name || employee.f_Name,
                    f_Email: f_Email || employee.f_Email,
                    f_Mobile: f_Mobile || employee.f_Mobile,
                    f_Designation: f_Designation || employee.f_Designation,
                    f_Gender: f_Gender || employee.f_Gender,
                    f_Course: f_Course || employee.f_Course,
                    f_Image: cloud_url,
                },
            },
            { new: true }
        );

        return res.status(200).json({
            message: 'Employee updated successfully',
            employee: updatedEmployee,
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getAdminName = async(req, res) => {
    const admin = await Admin.findOne(); 
        
        if (!admin) {
            return res.status(404).json(new ApiResponse(404, "Admin not found"));
        }
        
        return res.json(new ApiResponse(200, admin.username, "Admin fetched successfully"));
}

const deleteEmployee = asyncHandler(async (req, res) => {
    const email = req.params.email;  

    try {

        const user = await Employee.findOne({f_Email: email});
        await destroyOnCloudinary(user.f_Image);
        const result = await Employee.findOneAndDelete({f_Email: email});

        if (!result) {
            return res.status(404).json(new ApiResponse(404, {}, 'Employee not found'));
        }

        return res.status(200).json(new ApiResponse(200, {}, 'Employee deleted successfully'));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(200, {}, 'Error deleting employee'));
    }
});

export {
    adminSignup,
    adminLogin,
    logout,
    refreshAccessToken,
    getCurrentUser,
    createEmployee,
    getEmployees,
    editEmployee,
    getAdminName,
    deleteEmployee,
}