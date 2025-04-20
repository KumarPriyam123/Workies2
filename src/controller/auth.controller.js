import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import { ApiError } from '../utils/apiError.js';

// Environment variables
const FLASK_SERVICE_URL = process.env.FLASK_SERVICE_URL || 'http://localhost:5001';

/**
 * Register a user's face
 * Sends the image to Flask microservice for face encoding and storage
 */
export const faceRegister = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const imageFile = req.file;

  // Validate inputs
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  if (!imageFile) {
    return res.status(400).json({
      success: false,
      message: "Face image is required"
    });
  }

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      // Clean up uploaded file
      fs.unlinkSync(imageFile.path);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prepare form data for Flask service
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('image', fs.createReadStream(imageFile.path));

    // Send to Flask microservice
    const response = await axios.post(`${FLASK_SERVICE_URL}/register`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });

    // Clean up uploaded file
    fs.unlinkSync(imageFile.path);

    return res.status(200).json({
      success: true,
      message: "Face registered successfully",
      data: response.data
    });
  } catch (error) {
    console.error("Face registration error:", error);
    
    // Clean up uploaded file if exists
    if (imageFile && fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Face registration failed"
    });
  }
});

/**
 * Authenticate a user with facial recognition
 * Sends the image to Flask microservice for face recognition
 * Returns JWT token if authentication is successful
 */
export const faceLogin = asyncHandler(async (req, res) => {
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({
      success: false,
      message: "Face image is required"
    });
  }

  try {
    // Prepare form data for Flask service
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imageFile.path));

    // Send to Flask microservice for authentication
    const response = await axios.post(`${FLASK_SERVICE_URL}/authenticate`, formData, {
      headers: {
        ...formData.getHeaders(),
      }
    });

    // Clean up uploaded file
    fs.unlinkSync(imageFile.path);

    const { userId } = response.data;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Face authentication failed"
      });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update user's refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    };

    // Send response with tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Face authentication successful",
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          accessToken
        }
      });
  } catch (error) {
    console.error("Face authentication error:", error);
    
    // Clean up uploaded file if exists
    if (imageFile && fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    // Check if the error is from Flask service and return appropriate response
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Face not recognized"
      });
    }

    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Face authentication failed"
    });
  }
}); 