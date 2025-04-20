# WorkEase - Facial Recognition Authentication System

A facial recognition authentication system built using the MERN stack (MongoDB, Express, React, Node.js) with a Python Flask microservice for face recognition processing.

## Features

- User registration and login with facial recognition
- Secure authentication with JWT tokens
- Face detection and verification using face_recognition library
- MongoDB for storing user data and face embeddings
- Responsive React frontend with webcam integration

## System Architecture

The system consists of three main components:

1. **Frontend**: React application with webcam integration for capturing user faces
2. **Backend**: Express.js REST API for user management and authentication
3. **Microservice**: Python Flask service for facial recognition processing

## Prerequisites

- Node.js (v14+)
- Python 3.10+
- MongoDB
- npm or yarn
- pip (Python package manager)

## Setup Instructions

### Clone the repository

```bash
git clone https://github.com/your-username/workease.git
cd workease
```

### Backend Setup (Express)

1. Create a `.env` file in the root directory based on `.env.example`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an uploads directory:
   ```bash
   mkdir uploads
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Face Recognition Microservice (Flask)

1. Navigate to the face recognition service directory:
   ```bash
   cd faceRecognition
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Create a `.env` file based on `.env.example`
6. Create a directory for temporary uploads:
   ```bash
   mkdir temp_uploads
   ```
7. Start the Flask server:
   ```bash
   python app.py
   ```

## API Endpoints

### Auth Routes

- `POST /api/v1/auth/face-register`: Register a user's face
  - Request body: Form data with `userId` and `image` (file)
  - Response: Success message or error

- `POST /api/v1/auth/face-login`: Authenticate with face recognition
  - Request body: Form data with `image` (file)
  - Response: JWT tokens and user data or error

## Environment Variables

### Express Backend (.env)

```
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/workease
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
FLASK_SERVICE_URL=http://localhost:5001
```

### Flask Microservice (.env)

```
MONGO_URI=mongodb://localhost:27017
DB_NAME=faceauth
FACE_COLLECTION=face_embeddings
FACE_RECOGNITION_TOLERANCE=0.5
PORT=5001
FLASK_DEBUG=False
```

## Security Considerations

- All passwords are securely hashed
- JWT tokens are stored in HTTP-only cookies
- Temporary face images are deleted after processing
- CORS is configured to allow only specific origins
- Face recognition has adjustable tolerance settings

## License

This project is licensed under the ISC License.

## Acknowledgements

- [face_recognition](https://github.com/ageitgey/face_recognition) - Python library for facial recognition
- [React Webcam](https://github.com/mozmorris/react-webcam) - Webcam component for React
- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Flask](https://flask.palletsprojects.com/) - Python web framework 