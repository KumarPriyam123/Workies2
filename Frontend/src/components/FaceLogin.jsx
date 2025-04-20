import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const FaceLogin = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Configure webcam
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
  };

  // Capture image from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  // Reset captured image
  const retakeImage = () => {
    setCapturedImage(null);
  };

  // Convert base64 to blob for file upload
  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  // Handle face registration
  const handleFaceRegister = async () => {
    if (!capturedImage || !userId) {
      setMessage('Please capture an image and enter a user ID');
      return;
    }

    setIsLoading(true);
    setMessage('Processing...');

    try {
      // Convert the base64 image to a blob
      const imageBlob = base64ToBlob(capturedImage);
      
      // Create form data
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('image', imageBlob, 'face.jpg');

      // Send to backend
      const response = await axios.post('/api/v1/auth/face-register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage(response.data.message || 'Face registered successfully!');
      setCapturedImage(null);
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle face login
  const handleFaceLogin = async () => {
    if (!capturedImage) {
      setMessage('Please capture an image first');
      return;
    }

    setIsLoading(true);
    setMessage('Authenticating...');

    try {
      // Convert the base64 image to a blob
      const imageBlob = base64ToBlob(capturedImage);
      
      // Create form data
      const formData = new FormData();
      formData.append('image', imageBlob, 'face.jpg');

      // Send to backend
      const response = await axios.post('/api/v1/auth/face-login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Login successful!');
      
      // Redirect or update app state on successful login
      // For example:
      // window.location.href = '/dashboard';
      
      setCapturedImage(null);
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="face-login-container" style={{ 
      maxWidth: "600px", 
      margin: "0 auto", 
      padding: "20px",
      backgroundColor: "rgba(30, 30, 30, 0.95)",
      borderRadius: "1rem",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    }}>
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Facial Recognition</h2>
      
      {!showCamera ? (
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <button 
            onClick={() => setShowCamera(true)}
            style={{
              background: "linear-gradient(90deg, #8b5cf6, #14b8a6)",
              border: "none",
              borderRadius: "0.5rem",
              color: "white",
              padding: "0.625rem 1.25rem",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "1rem",
              width: "100%"
            }}
          >
            Start Camera
          </button>
        </div>
      ) : (
        <>
          {capturedImage ? (
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <img 
                src={capturedImage} 
                alt="Captured face" 
                style={{ 
                  maxWidth: "100%", 
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              />
              <button
                onClick={retakeImage}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "white",
                  padding: "0.625rem 1.25rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginTop: "1rem",
                  width: "100%"
                }}
              >
                Retake Photo
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <Webcam
                audio={false}
                height={400}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
                videoConstraints={videoConstraints}
                style={{ 
                  width: "100%", 
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.1)"
                }}
              />
              <button
                onClick={captureImage}
                style={{
                  background: "linear-gradient(90deg, #8b5cf6, #14b8a6)",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "white",
                  padding: "0.625rem 1.25rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "1rem",
                  width: "100%"
                }}
              >
                Capture Photo
              </button>
            </div>
          )}
        </>
      )}

      {capturedImage && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              User ID (required for registration):
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
              style={{
                width: "100%",
                padding: "0.625rem",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "0.5rem",
                color: "white",
                marginBottom: "1rem"
              }}
            />
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "1rem",
            marginBottom: "1rem"
          }}>
            <button
              onClick={handleFaceRegister}
              disabled={isLoading || !userId}
              style={{
                background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
                border: "none",
                borderRadius: "0.5rem",
                color: "white",
                padding: "0.625rem 1.25rem",
                fontWeight: "600",
                cursor: isLoading || !userId ? "not-allowed" : "pointer",
                opacity: isLoading || !userId ? 0.7 : 1
              }}
            >
              {isLoading ? "Processing..." : "Register Face"}
            </button>
            <button
              onClick={handleFaceLogin}
              disabled={isLoading}
              style={{
                background: "linear-gradient(90deg, #10b981, #14b8a6)",
                border: "none",
                borderRadius: "0.5rem",
                color: "white",
                padding: "0.625rem 1.25rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1
              }}
            >
              {isLoading ? "Processing..." : "Login with Face"}
            </button>
          </div>
        </div>
      )}

      {message && (
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "0.5rem",
            backgroundColor: message.includes("failed") || message.includes("error")
              ? "rgba(251, 113, 133, 0.2)"
              : "rgba(16, 185, 129, 0.2)",
            color: message.includes("failed") || message.includes("error")
              ? "#fb7185"
              : "#10b981",
            marginBottom: "1rem"
          }}
        >
          {message}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          onClick={() => {
            setShowCamera(false);
            setCapturedImage(null);
            setMessage('');
          }}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "none",
            borderRadius: "0.5rem",
            color: "white",
            padding: "0.625rem 1.25rem",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FaceLogin; 