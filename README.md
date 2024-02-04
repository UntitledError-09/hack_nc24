# Social Networking App API

This is a Flask REST API for a social networking app, featuring user registration, login, profile updates, and various user-related functionalities. It utilizes MongoDB as the database and JWT for user authentication.

## Requirements

- Python 3.x
- Flask
- Flask-RESTful
- Flask-PyMongo
- Flask-JWT-Extended
- pymongo

## Installation

1. Install the required Python packages:

    ```bash
    pip install Flask Flask-RESTful Flask-PyMongo Flask-JWT-Extended pymongo
    ```

2. Update the MongoDB URI and JWT secret key in `app.py`:

    ```python
    app.config['MONGO_URI'] = "your-mongodb-uri"
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'
    ```

## Usage

1. Run the Flask app:

    ```bash
    python app.py
    ```

2. Access the API at `http://127.0.0.1:5000/`.

## API Endpoints

- `/update-user/<string:username>` (PUT): Update user profile.
- `/get-all-users` (GET): Retrieve information about all users.
- `/get-matched-users/<string:username>` (GET): Get users who have accepted match requests.
- `/get-recommendations` (GET): Get users with matching interests.
- `/register` (POST): Register a new user.
- `/login` (POST): User login.
- `/event/<string:event_id>` (GET, PUT): Get or update a specific event.
- `/events` (GET, POST): Get all events or create a new one.
- `/delete-event/<string:event_id>` (DELETE): Delete a specific event.

## Notes

- Ensure that MongoDB is running and accessible.
- This is a basic implementation; consider adding security features and error handling for production.
