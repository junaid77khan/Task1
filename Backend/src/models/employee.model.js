import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
    f_Id: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(), 
        unique: true, 
    },
    f_Image: {
        type: String,
        required: [true, "Image is required"],
    },

    f_Name: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true,
    },

    f_Email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        validate: {
                validator: async function(value) {
                    const employee = await this.constructor.findOne({ f_Email: value });
                    return !employee;
                },
                message: props => `Email Id ${props.value} already exists`
        }
    },

    f_Mobile: {
            type: String,
            required: [true, "Mobile number is required"],
            trim: true,
            validate: {
                validator: async function(value) {
                    const employee = await this.constructor.findOne({ f_Mobile: value });
                    return !employee;
                },
                message: props => `Mobile number ${props.value} already exists`
            }
    },

    f_Designation: {
        type: String,
        enum: ["HR", "Manager", "Sales"],
        required: [true, "Designation is required"],
    },

    f_Gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: [true, "Gender is required"],
    },

    f_Course: {
        type: String,
        enum: ["MCA", "BCA", "BSC"],
        required: [true, "Course is required"],
    },

    f_CreateDate: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true});

export const Employee = mongoose.model("Employee", employeeSchema);
