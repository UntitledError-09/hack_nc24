import mongoengine as db

class Event(db.Document):
    _id = db.ObjectIdField()
    name = db.StringField(required=True)
    event_date = db.StringField(required=True)
    event_time = db.StringField(required=True)
    location = db.StringField()

