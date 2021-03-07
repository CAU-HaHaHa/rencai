from datetime import datetime
from mysql.create_db import db


class Corporation(db.Model):
    __tablename__ = 'corporation'
    corporation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    registeredcapital = db.Column(db.Integer)
    legalrepresentative = db.Column(db.String(255))
    registrationdate = db.Column(db.DateTime, default=datetime.now)
    tel = db.Column(db.String(255))
    email = db.Column(db.String(255))
    website = db.Column(db.String(255))
    location = db.Column(db.String(255))
    requirementinfo = db.Column(db.String(255))
    otherinfo = db.Column(db.String(255))
    is_register = db.Column(db.Boolean)
    is_delete = db.Column(db.Boolean)

    def __init__(self, corporation_id, name, registeredcapital=0, legalrepresentative="",
                 registrationdate=datetime.now, tel="", email="", website="",
                 location="", requirementinfo="", otherinfo="", is_register=0,
                 is_delete=0):
        self.corporation_id = corporation_id
        self.name = name
        self.registeredcapital = registeredcapital
        self.legalrepresentative = legalrepresentative
        self.registrationdate = registrationdate
        self.tel = tel
        self.email = email
        self.website = website
        self.tel = tel
        self.email = email
        self.location = location
        self.requirementinfo = requirementinfo
        self.otherinfo = otherinfo
        self.is_register = is_register
        self.is_delete = is_delete

    def save(self):
        db.session.add(self)
        db.session.commit()
