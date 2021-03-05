from datetime import datetime
from mysql.create_db import db


class Hr(db.Model):
    __tablename__ = 'hr'
    hr_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    corporation_id = db.Column(db.Integer)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255))
    sex = db.Column(db.Boolean)
    identitycard = db.Column(db.String(255))
    is_register = db.Column(db.Boolean)
    is_delete = db.Column(db.Boolean)

    def __init__(self, username, password, corporation_id, name, sex=0,
                 identitycard="000000000000000000",is_register=0,
                 is_delete=0):
        self.corporation_id = corporation_id
        self.username = username
        self.password = password
        self.name = name
        self.sex = sex
        self.identitycard = identitycard
        self.is_register = is_register
        self.is_delete = is_delete

    def save(self):
        db.session.add(self)
        db.session.commit()
