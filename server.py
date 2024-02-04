from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from pymongo.errors import PyMongoError

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb+srv://testuser:test123@cluster0.cbncbab.mongodb.net/?retryWrites=true&w=majority"
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
mongo = PyMongo(app)
api = Api(app)
jwt = JWTManager(app)


class UserSchema:
    def __init__(self, username, password, interests=None, strengths=None, matched_users=None, pending_invites=None):
        self.username = username
        self.password = password
        self.interests = interests or []
        self.strengths = strengths or []
        self.matched_users = matched_users or []
        self.pending_invites = pending_invites or []

    def to_dict(self):
        return {
            "username": self.username,
            "password": self.password,
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
            interests=data.get("interests", []),
            strengths=data.get("strengths", []),
            matched_users=data.get("matched_users", []),
            pending_invites=data.get("pending_invites", [])
        )


class UserResource(Resource):
    # @jwt_required()
    def get(self, user_id):
        user_data = mongo.db.users.find_one_or_404({"_id": user_id}, {"_id": 0})
        user_instance = UserSchema.from_dict(user_data)
        return jsonify(user_instance.to_dict())

#     @jwt_required()
    def put(self, user_id):
        current_user = get_jwt_identity()
        if current_user["_id"] != user_id:
            return {"message": "Unauthorized"}, 401

        data = request.get_json()
        user_instance = UserSchema.from_dict(data)
        mongo.db.users.update_one({"_id": user_id}, {"$set": user_instance.to_dict()})
        return {"message": "User updated successfully"}


class AllUsersResource(Resource):
#     @jwt_required()
    def get(self):
        all_users_data = list(mongo.db.users.find({}, {"_id": 0}))
        all_users_instances = [UserSchema.from_dict(user_data).to_dict() for user_data in all_users_data]
        return jsonify({"users": all_users_instances})


class MatchedUsersResource(Resource):
#     @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        matched_users_ids = current_user.get("matched_users", [])
        matched_users_data = list(mongo.db.users.find({"_id": {"$in": matched_users_ids}}, {"_id": 0}))
        matched_users_instances = [UserSchema.from_dict(user_data).to_dict() for user_data in matched_users_data]
        return jsonify({"matched_users": matched_users_instances})


class RecommendationsResource(Resource):
#     @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        interests = current_user.get("interests", [])
        recommendations_data = list(
            mongo.db.users.find({"interests": {"$in": interests}, "_id": {"$ne": current_user["_id"]}}, {"_id": 0}))
        recommendations_instances = [UserSchema.from_dict(user_data).to_dict() for user_data in recommendations_data]
        return jsonify({"recommendations": recommendations_instances})


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
            access_token = create_access_token(identity=UserSchema.from_dict(user_data).to_dict())
            return {"access_token": access_token}
        else:
            return {"message": "Invalid credentials"}, 401


api.add_resource(UserResource, '/update-user/<string:user_id>')
api.add_resource(AllUsersResource, '/get-all-users')
api.add_resource(MatchedUsersResource, '/get-matched-users')
api.add_resource(RecommendationsResource, '/get-recommendations')
api.add_resource(RegisterResource, '/register')
api.add_resource(LoginResource, '/login')

if __name__ == '__main__':
    app.run(debug=True)
