import os
import face_recognition
import numpy as np
from flask import Flask, request, jsonify
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, PyMongoError
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'faceauth')
COLLECTION_NAME = os.getenv('FACE_COLLECTION', 'face_embeddings')

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Configure face recognition tolerance (lower is more strict)
FACE_RECOGNITION_TOLERANCE = float(os.getenv('FACE_RECOGNITION_TOLERANCE', '0.5'))

@app.route('/register', methods=['POST'])
def register_face():
    """
    Register a user's face in the database
    
    Request should include:
    - userId: the ID of the user
    - image: the face image file
    
    Returns:
    - JSON response with success/error message
    """
    try:
        # Check if request has the userId field
        if 'userId' not in request.form:
            return jsonify({"message": "User ID is required"}), 400
            
        user_id = request.form['userId']
        
        # Check if image is included in the request
        if 'image' not in request.files:
            return jsonify({"message": "Image file is required"}), 400
            
        image_file = request.files['image']
        
        # Save the image temporarily
        filename = secure_filename(f"{user_id}_{image_file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(filepath)
        
        # Load the image
        face_image = face_recognition.load_image_file(filepath)
        
        # Find face locations in the image
        face_locations = face_recognition.face_locations(face_image)
        
        if len(face_locations) == 0:
            # Clean up the temporary file
            os.remove(filepath)
            return jsonify({"message": "No face detected in the image"}), 400
            
        if len(face_locations) > 1:
            # Clean up the temporary file
            os.remove(filepath)
            return jsonify({"message": "Multiple faces detected. Please submit an image with only one face."}), 400
        
        # Get face encodings
        face_encodings = face_recognition.face_encodings(face_image, face_locations)
        face_encoding = face_encodings[0]
        
        # Convert numpy array to list for MongoDB storage
        face_encoding_list = face_encoding.tolist()
        
        # Store in MongoDB
        try:
            # Check if user already has a face encoding
            existing_user = collection.find_one({"user_id": user_id})
            
            if existing_user:
                # Update existing record
                collection.update_one(
                    {"user_id": user_id},
                    {"$set": {"face_encoding": face_encoding_list}}
                )
                message = "Face updated successfully"
            else:
                # Insert new record
                collection.insert_one({
                    "user_id": user_id,
                    "face_encoding": face_encoding_list
                })
                message = "Face registered successfully"
                
            # Clean up the temporary file
            os.remove(filepath)
            
            return jsonify({"message": message}), 200
            
        except PyMongoError as e:
            # Clean up the temporary file
            os.remove(filepath)
            logger.error(f"Database error: {str(e)}")
            return jsonify({"message": "Failed to store face data"}), 500
            
    except Exception as e:
        logger.error(f"Error during face registration: {str(e)}")
        # Clean up the temporary file if it exists
        try:
            if 'filepath' in locals():
                os.remove(filepath)
        except:
            pass
        return jsonify({"message": f"Error processing face registration: {str(e)}"}), 500

@app.route('/authenticate', methods=['POST'])
def authenticate_face():
    """
    Authenticate a face against the database
    
    Request should include:
    - image: the face image file
    
    Returns:
    - JSON with userId if face is recognized, or error message
    """
    try:
        # Check if image is included in the request
        if 'image' not in request.files:
            return jsonify({"message": "Image file is required"}), 400
            
        image_file = request.files['image']
        
        # Save the image temporarily
        filename = secure_filename(f"auth_{image_file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(filepath)
        
        # Load the image
        face_image = face_recognition.load_image_file(filepath)
        
        # Find face locations in the image
        face_locations = face_recognition.face_locations(face_image)
        
        if len(face_locations) == 0:
            # Clean up the temporary file
            os.remove(filepath)
            return jsonify({"message": "No face detected in the image"}), 400
            
        if len(face_locations) > 1:
            # Clean up the temporary file
            os.remove(filepath)
            return jsonify({"message": "Multiple faces detected. Please submit an image with only one face."}), 400
        
        # Get face encodings
        face_encodings = face_recognition.face_encodings(face_image, face_locations)
        face_encoding = face_encodings[0]
        
        # Retrieve all face embeddings from database
        all_users = list(collection.find())
        
        if not all_users:
            # Clean up the temporary file
            os.remove(filepath)
            return jsonify({"message": "No registered faces found in the database"}), 404
        
        # Check each user for a face match
        for user in all_users:
            stored_encoding = np.array(user['face_encoding'])
            
            # Compare faces
            match = face_recognition.compare_faces(
                [stored_encoding], 
                face_encoding, 
                tolerance=FACE_RECOGNITION_TOLERANCE
            )[0]
            
            if match:
                # Clean up the temporary file
                os.remove(filepath)
                return jsonify({"userId": user['user_id']}), 200
        
        # If no match found
        # Clean up the temporary file
        os.remove(filepath)
        return jsonify({"message": "Face not recognized"}), 401
        
    except Exception as e:
        logger.error(f"Error during face authentication: {str(e)}")
        # Clean up the temporary file if it exists
        try:
            if 'filepath' in locals():
                os.remove(filepath)
        except:
            pass
        return jsonify({"message": f"Error processing face authentication: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() in ['true', '1', 't']
    app.run(host='0.0.0.0', port=port, debug=debug) 