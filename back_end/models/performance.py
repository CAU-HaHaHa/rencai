from datetime import datetime
from mysql.create_db import db


class Performance(db.Model):
    __tablename__ = 'performance'
    performance_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    corporation_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    hr_id = db.Column(db.Integer)
    value = db.Column(db.Integer)
    description = db.Column(db.Text)
    registerdate = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, corporation_id, user_id, hr_id, value=0,
                 description="", registerdate=datetime.now):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.hr_id = hr_id
        self.value = value
        self.description = description
        self.registerdate = registerdate

    def save(self):
        db.session.add(self)
        db.session.commit()
