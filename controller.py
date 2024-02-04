from event import Event

def create_event(name, date, time, length, location):

    event = Event()
    event.name = name
    event.event_date = date
    event.event_time = time
    event.location = location
    event.save()

