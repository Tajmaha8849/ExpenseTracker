from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import bcrypt
import os
import json
from bson import json_util

app = Flask(__name__)
CORS(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'yufu76b77r6btuggbjguyjuy'  # Change this in production!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# MongoDB Connection
client = MongoClient('mongodb+srv://admin:ShubhamP@cluster0.0miowwk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['Better']
users_collection = db['users']
expenses_collection = db['expenses']

# Helper function to parse MongoDB data to JSON
def parse_json(data):
    return json.loads(json_util.dumps(data))

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if username already exists
    if users_collection.find_one({'username': data['username']}):
        return jsonify({'error': 'Username already exists'}), 400
    
    # Hash the password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Create new user
    new_user = {
        'username': data['username'],
        'password': hashed_password.decode('utf-8'),
        'created_at': datetime.utcnow()
    }
    
    users_collection.insert_one(new_user)
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Find user by username
    user = users_collection.find_one({'username': data['username']})
    
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    # Create access token
    access_token = create_access_token(identity=str(user['_id']))
    
    return jsonify({
        'access_token': access_token,
        'user_id': str(user['_id']),
        'username': user['username']
    }), 200

@app.route('/add-expense', methods=['POST'])
@jwt_required()
def add_expense():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Create new expense
    new_expense = {
        'user_id': current_user_id,
        'amount': float(data['amount']),
        'category': data['category'],
        'note': data.get('note', ''),
        'date': datetime.fromisoformat(data['date'].replace('Z', '+00:00')),
        'created_at': datetime.utcnow()
    }
    
    result = expenses_collection.insert_one(new_expense)
    
    return jsonify({
        'message': 'Expense added successfully',
        'expense_id': str(result.inserted_id)
    }), 201

@app.route('/get-expenses', methods=['GET'])
@jwt_required()
def get_expenses():
    user_id = get_jwt_identity()
    expenses = list(db.expenses.find({"user_id": user_id}))
    for expense in expenses:
        expense['_id'] = str(expense['_id'])  # Convert ObjectId to string
    return jsonify(expenses), 200
    #return jsonify(parse_json(expenses)), 200

@app.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    current_user_id = get_jwt_identity()
    
    # Get category totals
    pipeline = [
        {'$match': {'user_id': current_user_id}},
        {'$group': {
            '_id': '$category',
            'total': {'$sum': '$amount'}
        }},
        {'$sort': {'total': -1}}
    ]
    category_totals = list(expenses_collection.aggregate(pipeline))
    
    # Get monthly totals
    pipeline = [
        {'$match': {'user_id': current_user_id}},
        {'$project': {
            'month': {'$month': '$date'},
            'year': {'$year': '$date'},
            'amount': 1
        }},
        {'$group': {
            '_id': {'month': '$month', 'year': '$year'},
            'total': {'$sum': '$amount'}
        }},
        {'$sort': {'_id.year': 1, '_id.month': 1}}
    ]
    monthly_totals = list(expenses_collection.aggregate(pipeline))
    
    return jsonify({
        'category_totals': parse_json(category_totals),
        'monthly_totals': parse_json(monthly_totals)
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
