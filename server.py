from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from pymongo.errors import PyMongoError
from flask import jsonify
from event import Event
import controller as con

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb+srv://testuser:test123@cluster0.cbncbab.mongodb.net/main?retryWrites=true&w=majority"
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
mongo = PyMongo(app)
api = Api(app)
jwt = JWTManager(app)


class UserSchema:
    def __init__(self, username, password, age, interests=None, strengths=None, matched_users=None, pending_invites=None):
        self.username = username
        self.password = password
        self.age = age
        self.interests = interests or []
        self.strengths = strengths or []
        self.matched_users = matched_users or []
        self.pending_invites = pending_invites or []

    def to_dict(self):
        return {
            "username": self.username,
            "password": self.password,
            "age": self.age,
            "interests": self.interests,
            "strengths": self.strengths,
            "matched_users": self.matched_users,
            "pending_invites": self.pending_invites
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            username=data["username"],
            password=data["password"],
            age=data["age"],
            interests=data.get("interests", []),
            strengths=data.get("strengths", []),
            matched_users=data.get("matched_users", []),
            pending_invites=data.get("pending_invites", [])
        )


class UserResource(Resource):
    def get(self, user_id):
        user_data = mongo.db.users.find_one_or_404({"_id": user_id}, {"_id": 0})
        user_instance = UserSchema.from_dict(user_data)
        return jsonify(user_instance.to_dict())

    def put(self, username):
        # current_user = get_jwt_identity()
        # if current_user["username"] != username:
        #     return {"message": "Unauthorized"}, 401

        data = request.get_json()
        user_instance = UserSchema.from_dict(data)
        mongo.db.users.update_one({"username": username}, {"$set": user_instance.to_dict()})
        return {"message": "User updated successfully"}


class AllUsersResource(Resource):
    def get(self):
        all_users_data = list(mongo.db.users.find({}, {"_id": 0}))
        all_users_instances = [UserSchema.from_dict(user_data).to_dict() for user_data in all_users_data]
        return jsonify({"users": all_users_instances})


class MatchedUsersResource(Resource):
    def get(self, username):
        # current_user = get_jwt_identity()
        # matched_users_ids = current_user.get("matched_users", [])
        matched_usernames = mongo.db.users.find_one({"username": username})["matched_users"]
        matched_users_data = list(mongo.db.users.find({"username": {"$in": matched_usernames}}, {"_id": 0}))
        matched_users_instances = [UserSchema.from_dict(user_data).to_dict() for user_data in matched_users_data]
        return jsonify({"matched_users": matched_users_instances})


class RecommendationsResource(Resource):
    def get(self, user_id):
        user_interests = mongo.db.users.find_one({'_id': user_id})['interests']
        similar_users = []

        for user in mongo.db.users.find({'_id': {'$ne': user_id}}):
            common_interests = set(user['interests']) & set(user_interests)
            if len(common_interests) > 0:
                similar_users.append(user)

        similar_users_dict = [{'_id': user['_id'], 'interests': user['interests']} for user in similar_users]
        return jsonify(similar_users=similar_users_dict)


class RegisterResource(Resource):
    def post(self):
        data = request.get_json()
        user_instance = UserSchema.from_dict(data)

        try:
            user_id = mongo.db.users.insert_one(user_instance.to_dict()).inserted_id
            return {"message": "User registered successfully", "user_id": str(user_id)}
        except PyMongoError as e:
            return {"message": f"Error registering user: {str(e)}"}, 500


class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username", "")
        password = data.get("password", "")

        user_data = mongo.db.users.find_one({"username": username, "password": password}, {"_id": 1})
        if user_data:
            access_token = create_access_token(identity=username)
            return {"access_token": access_token}
        else:
            return {"message": "Invalid credentials"}, 401


class EventResource(Resource):
    def get(self, event_id):
        event_data = mongo.db.events.find_one_or_404({"_id": event_id}, {"_id": 0})
        return jsonify(event_data)

    def put(self, event_id):
        data = request.get_json()
        mongo.db.events.update_one({"_id": event_id}, {"$set": data})
        return {"message": "Event updated successfully"}

    def delete(self, event_id):
        mongo.db.events.delete_one({"_id": event_id})
        return {"message": "Event deleted successfully"}


class EventsResource(Resource):
    def get(self):
        all_events = list(mongo.db.events.find({}, {"_id": 0}))
        return jsonify(all_events)

    def post(self):
        data = request.get_json()
        event_id = mongo.db.events.insert_one(data).inserted_id
        return {"message": "Event created successfully", "event_id": str(event_id)}


class DeleteEventResource(Resource):
    def delete(self, event_id):
        mongo.db.events.delete_one({"_id": event_id})
        return {"message": "Event deleted successfully"}


api.add_resource(UserResource, '/update-user/<string:username>')
api.add_resource(AllUsersResource, '/get-all-users')
api.add_resource(MatchedUsersResource, '/get-matched-users/<string:username>')
api.add_resource(RecommendationsResource, '/get-recommendations')
api.add_resource(RegisterResource, '/register')
api.add_resource(LoginResource, '/login')
api.add_resource(EventResource, '/event/<string:event_id>')
api.add_resource(EventsResource, '/events')
api.add_resource(DeleteEventResource, '/delete-event/<string:event_id>')

if __name__ == '__main__':
    app.run(debug=True)