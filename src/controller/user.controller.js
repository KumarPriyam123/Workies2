import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../model/user.model.js';
import { ApiError } from '../utils/apiError.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    // Get user details from frontend
    console.log("Request body:", req.body);
    const {name, email, password, field, education} = req.body;
    console.log("Extracted values:", {name, email, password, field, education});

    // Validation - check if fields are not empty
    if ([name, email, password].some(field => !field || field.trim() === "")) {
        console.log("Validation failed for required fields");
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    // Check if user already exists with email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "User with email already exists"
        });
    }

    // Create user object and entry in DB
    const user = await User.create({
        name,
        email,
        password,
        field: field || "Others",
        education: education || ""
    });

    // Check for user creation
    const createdUser = await User.findById(user._id).select(
        "-password"
    );

    if (!createdUser) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user"
        });
    }

    // Return response
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: createdUser
    });
});

const loginUser = asyncHandler(async (req, res) => {
    // Get data from req body
    const {email, password} = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    // Find user by email
    const user = await User.findOne({email});

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Password check
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Generate tokens
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    // Get user object without password and refreshToken
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookies options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    // Send response with cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "User logged in successfully",
            data: {
                user: loggedInUser,
                accessToken,
                refreshToken
            }
        });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Get refresh token from cookies or body
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token is required"
        });
    }

    try {
        // Verify refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Find user with that token
        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        // Check if incoming refresh token matches stored refresh token
        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or used"
            });
        }

        // Generate new tokens
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

        // Set cookies options
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        };

        // Send response with new tokens
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "Access token refreshed",
                data: {
                    accessToken,
                    refreshToken
                }
            });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error?.message || "Invalid refresh token"
        });
    }
});

const getUserDetails = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    
    const user = await User.findById(userId).select("-password -refreshToken");
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    
    return res.status(200).json({
        success: true,
        data: user
    });
});

export {registerUser, loginUser, refreshAccessToken, getUserDetails}
