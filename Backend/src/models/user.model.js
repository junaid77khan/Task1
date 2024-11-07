import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const adminSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    refreshToken: {
        type: String
    }
    
}, {timestamps: true})


// Encrypt the password whenever password changes
adminSchema.pre("save", async function(next) {
    if( !this.isModified("password") ) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (error) {
        return next(error)
    }
})

// Validate Password
adminSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// generate-access-token - it is fast, No async-await
adminSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            fullName: this.fullName,
            email: this.email
        }, 
        
        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// generate-refresh-token - it is fast, No async-await
adminSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        }, 
        
        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Admin = mongoose.model("User", adminSchema)