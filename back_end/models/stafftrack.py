from datetime import datetime
from mysql.create_db import db


class Stafftrack(db.Model):
    __tablename__ = 'stafftrack'
    stafftrack_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    corporation_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)

    arrivetime = db.Column(db.DateTime, default=datetime.now)
    departtime = db.Column(db.DateTime, default=datetime.now)
    dutytype = db.Column(db.String(255))
    description = db.Column(db.String(255))

    def __init__(self, corporation_id, user_id,
                 arrivetime=datetime.now, departtime=datetime.now,
                 dutytype="", description=""):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.arrivetime = arrivetime
        self.departtime = departtime
        self.dutytype = dutytype
        self.description = description

    def save(self):
        db.session.add(self)
        db.session.commit()
