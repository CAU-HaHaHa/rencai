from datetime import datetime
from mysql.create_db import db


class Applylist(db.Model):
    __tablename__ = 'applylist'
    applylist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    recruitpost_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(255))
    registrationdate = db.Column(db.DateTime, default=datetime.now)

    def __init__(self, recruitpost_id, user_id, description="", registrationdate=datetime.now):
        self.recruitpost_id = recruitpost_id
        self.user_id = user_id
        self.description = description
        self.registrationdate = registrationdate

    def save(self):
        db.session.add(self)
        db.session.commit()
