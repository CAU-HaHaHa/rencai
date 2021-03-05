from datetime import datetime
from mysql.create_db import db


class Person(db.Model):
    __tablename__ = 'person'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255))
    sex = db.Column(db.Boolean)
    identitycard = db.Column(db.String(255))
    tags = db.Column(db.String(255))
    edubackground = db.Column(db.String(255))
    briefintro = db.Column(db.String(255))
    tel = db.Column(db.String(255))
    email = db.Column(db.String(255))
    politicsstatus = db.Column(db.String(255))
    address = db.Column(db.String(255))
    postcode = db.Column(db.String(255))
    workaddress = db.Column(db.String(255))

    def __init__(self, username, password, name="", sex=0,
                 identitycard="000000000000000000",
                 tags="", edubackground="", briefintro="", tel="", email="",
                 politicsstatus="", address="", postcode="", workaddress=""):
        self.username = username
        self.password = password
        self.name = name
        self.sex = sex
        self.identitycard = identitycard
        self.tags = tags
        self.edubackground = edubackground
        self.briefintro = briefintro
        self.tel = tel
        self.email = email
        self.politicsstatus = politicsstatus
        self.address = address
        self.postcode = postcode
        self.workaddress = workaddress

    def save(self):
        db.session.add(self)
        db.session.commit()
