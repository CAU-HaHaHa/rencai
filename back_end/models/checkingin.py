from datetime import datetime
from mysql.create_db import db


class Checkingin(db.Model):
    __tablename__ = 'checkingin'
    checkingin_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    corporation_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    recordmonth = db.Column(db.Integer)
    record = db.Column(db.String(255))

    def __init__(self, corporation_id,user_id,
                 recordmonth=0, record="0000000000000000000000000000000"):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.recordmonth = recordmonth
        self.record = record

    def save(self):
        db.session.add(self)
        db.session.commit()
