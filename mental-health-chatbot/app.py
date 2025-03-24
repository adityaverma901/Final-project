from flask import Flask, request, jsonify
import pandas as pd
import json
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
            json_responses.append(responses[0])
        else:
            print(f"Warning: No valid responses found for pattern '{pattern}' in JSON.")
            json_responses.append("I'm sorry, I don't have an answer for that.")  # Default response

json_embeddings = model.encode(json_patterns, convert_to_tensor=True)

# Function to get an exact match response from JSON
def get_response_from_json(user_input):
    for intent in intents:
        for pattern in intent.get('patterns', []):  # Ensure 'patterns' key exists
            if user_input.lower() in pattern.lower():  # Match the pattern (case-insensitive)
                return intent['responses'][0]  # Return the first response for the matched pattern
    return None

# Function to get an exact match answer from CSV
def get_answer_from_csv(user_input):
    for index, row in csv_data_1.iterrows():
        if user_input.lower() in row['Questions'].lower():  # Match the question (case-insensitive)
            return row['Answers']  # Return the answer from the CSV dataset
    return None

# Function to get the best-matched response from JSON using NLP
def get_best_match_from_json(user_input):
    user_embedding = model.encode(user_input, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(user_embedding, json_embeddings)[0]
    best_match_idx = similarities.argmax().item()
    confidence = similarities[best_match_idx].item()
    
    if confidence > 0.7:  # Only return if confidence is above a threshold
        return json_responses[best_match_idx]
    return None

# Function to get the best-matched answer from CSV using NLP
def get_best_match_from_csv(user_input):
    user_embedding = model.encode(user_input, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(user_embedding, csv_embeddings)[0]
    best_match_idx = similarities.argmax().item()
    confidence = similarities[best_match_idx].item()
    
    if confidence > 0.7:  # Only return if confidence is above a threshold
        return csv_data_1.iloc[best_match_idx]['Answers']
    return None

# Main function to get a response
def get_response(user_input):
    # Try exact match first
    response = get_response_from_json(user_input)
    if response:
        return response

    response = get_answer_from_csv(user_input)
    if response:
        return response
    
    # Try NLP-based matching if exact match fails
    response = get_best_match_from_json(user_input)
    if response:
        return response

    response = get_best_match_from_csv(user_input)
    if response:
        return response
    
    return "Sorry, I didn't understand that."

# Route for the chatbot
@app.route('/get-response', methods=['POST'])
def get_bot_response():
    user_input = request.json['input']
    print(f"Received input: {user_input}")  # Debugging statement
    response = get_response(user_input)
    return jsonify({'response': response})

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
