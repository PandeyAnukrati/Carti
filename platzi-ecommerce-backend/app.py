

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import google.generativeai as genai
from dotenv import load_dotenv 


load_dotenv()

app = Flask(__name__)
CORS(app) 

# Configure Gemini API
# Get API key from environment variable
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set. Please create a .env file.")

genai.configure(api_key=GEMINI_API_KEY)



products_data = []
try:

    with open('ecommerce_mock_data_200.json', 'r') as f:
        products_data = json.load(f)
    print(f"Loaded {len(products_data)} products from JSON.")
except FileNotFoundError:
    print("Error: ecommerce_mock_data_200.json not found. Please ensure it's in the correct directory.")
    products_data = []
except json.JSONDecodeError:
    print("Error: Could not decode JSON from products file. Check file format.")
    products_data = []


@app.route('/')
def home():
    return "Flask backend is running!"


@app.route('/api/products', methods=['GET'])
def get_products():
    query = request.args.get('q', '').lower()
    category = request.args.get('category', '').lower()
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    gender = request.args.get('gender', '').lower()
    brand = request.args.get('brand', '').lower()
    sizes = request.args.getlist('sizes')
    colors = request.args.getlist('colors')
    min_rating = request.args.get('min_rating', type=float)

    filtered_products = products_data

    if query:
        filtered_products = [
            p for p in filtered_products
            if query in p.get('name', '').lower() or
               query in p.get('description', '').lower() or
               query in p.get('brand', '').lower() or
               query in p.get('category', '').lower()
        ]
    if category:
        filtered_products = [p for p in filtered_products if p.get('category', '').lower() == category]
    if min_price is not None:
        filtered_products = [p for p in filtered_products if p.get('price', 0) >= min_price]
    if max_price is not None:
        filtered_products = [p for p in filtered_products if p.get('price', float('inf')) <= max_price]
    if gender:
        filtered_products = [p for p in filtered_products if p.get('gender', '').lower() == gender]
    if brand:
        filtered_products = [p for p in filtered_products if p.get('brand', '').lower() == brand]
    if sizes:
        filtered_products = [p for p in filtered_products if any(s.lower() in [item.lower() for item in p.get('sizes', [])] for s in sizes)]
    if colors:
        filtered_products = [p for p in filtered_products if any(c.lower() in [item.lower() for item in p.get('colors', [])] for c in colors)]
    if min_rating is not None:
        filtered_products = [p for p in filtered_products if p.get('rating', 0) >= min_rating]

    return jsonify(filtered_products)


@app.route('/api/chat_with_gemini', methods=['POST'])
def chat_with_gemini():
    try:
        data = request.json
        user_message = data.get('message')

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

 
        model = genai.GenerativeModel('gemini-1.5-flash-latest')


        response = model.generate_content(user_message)


        gemini_response_text = response.text
        return jsonify({'response': gemini_response_text})

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({'error': f'Failed to get response from AI: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)