from datetime import datetime
from mysql.create_db import db


class Recruitpost(db.Model):
    __tablename__ = 'recruitpost'
    recruitpost_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    corporation_id = db.Column(db.Integer)
    department = db.Column(db.String(255))
    number = db.Column(db.Integer)
    description = db.Column(db.Text)
    isposted = db.Column(db.Boolean)
    registerdate = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, corporation_id, department="",
                 number=0, description="", isposted=0, registerdate=datetime.now):
        self.corporation_id = corporation_id
        self.department = department
        self.number = number
        self.isposted = isposted
        self.description = description
        self.registerdate = registerdate

    def save(self):
        db.session.add(self)
        db.session.commit()
