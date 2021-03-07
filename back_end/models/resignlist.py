from datetime import datetime
from mysql.create_db import db


class Resignlist(db.Model):
    __tablename__ = 'resignlist'
    resignlist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer)
    description = db.Column(db.Text)
    registerdate = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, user_id, description="",
                 registerdate=datetime.now):
        self.user_id = user_id
        self.description = description
        self.registerdate = registerdate

    def save(self):
        db.session.add(self)
        db.session.commit()
