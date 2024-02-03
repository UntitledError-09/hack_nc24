import hashlib
import os
import datetime
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

uri = f"mongodb+srv://{os.getenv('MONGODB_USERNAME')}:{os.getenv('MONGODB_PASSWORD')}@cluster0.cbncbab.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

app = Flask(__name__)
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)

db = client["demo"]
users_collection = db["users"]


@app.get('/')
def landing_page():
    return jsonify({'msg': 'Hello'}), 200


@app.get('/get-all-users')
def get_all_users():
    all_users = list(users_collection.find())
    return jsonify({"users": all_users})





@app.route("/api/v1/users", methods=["POST"])
def register():
    new_user = request.get_json()  # store the json body request
    new_user["password"] = hashlib.sha256(new_user["password"].encode("utf-8")).hexdigest()  # encrpt password
    doc = users_collection.find_one({"username": new_user["username"]})  # check if user exist
    if not doc:
        users_collection.insert_one(new_user)
        return jsonify({'msg': 'User created successfully'}), 201
    else:
        return jsonify({'msg': 'Username already exists'}), 409


@app.route("/api/v1/login", methods=["POST"])
def login():
    login_details = request.get_json()  # store the json body request
    user_from_db = users_collection.find_one({'username': login_details['username']})  # search for user in database

    if user_from_db:
        encrpted_password = hashlib.sha256(login_details['password'].encode("utf-8")).hexdigest()
        if encrpted_password == user_from_db['password']:
            access_token = create_access_token(identity=user_from_db['username'])  # create jwt token
            return jsonify(access_token=access_token), 200

    return jsonify({'msg': 'The username or password is incorrect'}), 401


@app.route("/api/v1/user", methods=["GET"])
@jwt_required
def profile():
    current_user = get_jwt_identity()  # Get the identity of the current user
    user_from_db = users_collection.find_one({'username': current_user})
    if user_from_db:
        del user_from_db['_id'], user_from_db['password']  # delete data we don't want to return
        return jsonify({'profile': user_from_db}), 200
    else:
        return jsonify({'msg': 'Profile not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
