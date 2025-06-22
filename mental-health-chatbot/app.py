from flask import Flask, request, jsonify
import pandas as pd
import json
import random  # Import random module for selecting random responses
from flask_cors import CORS  # To allow cross-origin requests
from sentence_transformers import SentenceTransformer, util  # NLP Model

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Only allow requests from the frontend

# Load NLP Model (SBERT for semantic similarity)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Load the first CSV dataset (for chatbot responses)
csv_data_1 = pd.read_csv('Mental_Health_FAQ.csv')

# Load the second CSV dataset (for chatbot statements)
csv_data_2 = pd.read_csv('Combined_Data.csv')

# Clean both CSV datasets
csv_data_1['Questions'] = csv_data_1['Questions'].str.strip().str.lower()
csv_data_1['Answers'] = csv_data_1['Answers'].str.strip()
csv_data_2['statement'] = csv_data_2['statement'].str.strip().str.lower()
csv_data_2['status'] = csv_data_2['status'].str.strip()

# Load the JSON dataset (for chatbot intents)
with open('KB.json', 'r') as file:
    json_data = json.load(file)

# Access the 'intents' key (contains chatbot data)
intents = json_data['intents']

# Precompute embeddings for CSV questions
csv_questions = csv_data_1['Questions'].tolist()
csv_embeddings = model.encode(csv_questions, convert_to_tensor=True)

# Precompute embeddings for JSON patterns
json_patterns = []
json_responses = []

for intent in intents:
    print(f"Processing intent: {intent}")  # Debugging line
    patterns = intent.get('patterns', [])  # Ensure 'patterns' key exists
    responses = intent.get('responses', [])  # Ensure 'responses' key exists

    for pattern in patterns:
        json_patterns.append(pattern)

        if isinstance(responses, list) and responses:  # Ensure responses is a list and not empty
            json_responses.append(responses)  # Store the entire list of responses
        else:
            print(f"Warning: No valid responses found for pattern '{pattern}' in JSON.")
            json_responses.append(["I'm sorry, I don't have an answer for that."])  # Default response as a list

json_embeddings = model.encode(json_patterns, convert_to_tensor=True)

# Enhanced function to format recommendation response
def transform_recommendations(recommendation):
    """
    Convert recommendation to a more frontend-friendly format
    """
    print(f"Transforming recommendation: {recommendation}")  # Debug print
    
    # If recommendation is a simple string, return it as text
    if isinstance(recommendation, str):
        return {
            "text": recommendation,
            "recommendations": []
        }
    
    # Handle recommendation from JSON with 'type' key
    if isinstance(recommendation, dict):
        # Check if it's a recommendation or has resources
        if recommendation.get('type') == 'recommendation' or 'resources' in recommendation:
            recommendations = []
            for resource in recommendation.get('resources', []):
                recommendations.append({
                    "title": resource.get('title', 'Recommendation'),
                    "description": f"Platform: {resource.get('platform', 'Not specified')} | Duration: {resource.get('duration', 'Not specified')}",
                    "link": resource.get('link', ''),
                    "category": resource.get('category', 'General'),
                    "imageUrl": None  # Placeholder for potential image URLs
                })
            
            return {
                "text": recommendation.get('description', 'Here are some recommendations:'),
                "recommendations": recommendations
            }
    
    # Fallback to text response
    return {
        "text": str(recommendation),
        "recommendations": []
    }

# Updated get_response function with prioritized matching and random response selection
def get_response(user_input):
    print(f"Processing input: {user_input}")  # Debug print
    
    # Step 1: Exact Match - Check for completely identical patterns
    for intent in intents:
        for pattern in intent.get('patterns', []):
            if user_input.lower().strip() == pattern.lower().strip():
                print(f"Found exact pattern match: {pattern}")
                responses = intent.get('responses', [])
                if responses:
                    # Select a random response instead of always the first one
                    response = random.choice(responses)
                    return transform_recommendations(response)
    
    # Step 2: Exact Match from CSV
    for index, row in csv_data_1.iterrows():
        if user_input.lower().strip() == row['Questions'].lower().strip():
            return {"text": row['Answers'], "recommendations": []}
    
    # Step 3: NLP-based Semantic Matching from JSON
    user_embedding = model.encode(user_input, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(user_embedding, json_embeddings)[0]
    best_match_idx = similarities.argmax().item()
    confidence = similarities[best_match_idx].item()
    
    print(f"Best JSON semantic match confidence: {confidence}")
    
    if confidence > 0.6:  # Adjusted threshold for semantic matching
        matched_pattern = json_patterns[best_match_idx]
        for intent in intents:
            if matched_pattern in intent.get('patterns', []):
                responses = intent.get('responses', [])
                if responses:
                    print(f"Found semantic JSON match: {matched_pattern}")
                    # Select a random response
                    response = random.choice(responses)
                    return transform_recommendations(response)
    
    # Step 4: NLP-based Semantic Matching from CSV
    csv_similarities = util.pytorch_cos_sim(user_embedding, csv_embeddings)[0]
    best_csv_match_idx = csv_similarities.argmax().item()
    csv_confidence = csv_similarities[best_csv_match_idx].item()
    
    if csv_confidence > 0.7:
        response = csv_data_1.iloc[best_csv_match_idx]['Answers']
        return {"text": response, "recommendations": []}
    
    # Fallback response
    return {"text": "Sorry, I didn't understand that. Could you rephrase?", "recommendations": []}

# Route for the chatbot
@app.route('/api/chat', methods=['POST'])
def get_bot_response():
    user_input = request.json['message']
    print(f"Received input: {user_input}")  # Debugging statement
    
    response = get_response(user_input)
    
    # Ensure we always return a valid JSON response
    print(f"Sending response: {response}")  # Debug print
    return jsonify(response)

# Route for getting a doctor's profile
@app.route('/doctors/<int:doctor_id>', methods=['GET'])
def get_doctor_profile(doctor_id):
    doctors = [
        {
            "id": 1,
            "name": "Dr. Kavita Mehra",
            "specialty": "General Mental Health",
            "experience": "10 years",
            "contact": "+91-9876543210",
            "address": "123 Wellness Road, New Delhi",
            "image_url": "data:image/jpeg;base64,..."
        },
        {
            "id": 2,
            "name": "Dr. Anil Sharma",
            "specialty": "Child Psychiatry",
            "experience": "8 years",
            "contact": "+91-9876543211",
            "address": "456 Care Avenue, Mumbai",
            "image_url": "data:image/jpeg;base64,..."
        }
    ]

    doctor = next((doc for doc in doctors if doc["id"] == doctor_id), None)
    if doctor:
        return jsonify(doctor), 200
    else:
        return jsonify({"error": "Doctor not found"}), 404

# Route for booking an appointment
@app.route('/book-appointment', methods=['POST'])
def book_appointment():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    date = data.get('date')
    reason = data.get('reason')
    doctor_id = data.get('doctor_id')

    print(f"New appointment: {name}, {email}, {date}, {reason}, doctor_id: {doctor_id}")

    return jsonify({"message": "Appointment booked successfully"}), 200

# Home route
@app.route('/')
def home():
    return '''<h1>Welcome to the Inner Voice API</h1>
              <p>Use /get-response for chatbot and /doctor/<id> for doctor profiles.</p>'''

if __name__ == '__main__':
    app.run(debug=True)