from datetime import datetime
from mysql.create_db import db


class Stafflist(db.Model):
    __tablename__ = 'stafflist'
    stafflist_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    corporation_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    hr_id = db.Column(db.Integer)
    transferreason = db.Column(db.Text)
    lastcorporation_id = db.Column(db.Integer)
    hiredate = db.Column(db.DateTime, default=datetime.now)
    dutytype = db.Column(db.String(255))
    department = db.Column(db.String(255))
    jobnumber = db.Column(db.String(255))
    description = db.Column(db.String(255))

    def __init__(self, corporation_id, user_id, hr_id,
                 transferreason="", lastcorporation_id=0, hiredate=datetime.now,
                 dutytype="", department="", jobnumber="", description=""):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.hr_id = hr_id
        self.transferreason = transferreason
        self.lastcorporation_id = lastcorporation_id
        self.hiredate = hiredate
        self.dutytype = dutytype
        self.department = department
        self.jobnumber = jobnumber
        self.description = description

    def save(self):
        db.session.add(self)
        db.session.commit()
