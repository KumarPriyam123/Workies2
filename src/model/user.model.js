import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
    },
    email: {
    type: String,
    required: true,
    unique: true
    },
    password: {
    type: String,
    required: true
    },
    theme_settings: {
    type: String,
    default: 'dark'
    },
    view_preference: {
    type: String,
    enum: ['kanban', 'table', 'calendar'],
    default: 'kanban'
    },
    created_at: {
    type: Date,
    default: Date.now
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check password
UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT token
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
    {
        _id: this._id,
        email: this.email,
        name: this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    );
};
// Generate refresh token
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
    {
        _id: this._id
    ,
    email: this.email,
    name: this.name
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    );
};


const User = mongoose.model('User', UserSchema);
export default User;


