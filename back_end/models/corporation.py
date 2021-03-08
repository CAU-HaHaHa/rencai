from datetime import datetime
from mysql.create_db import db


class Corporation(db.Model):
    __tablename__ = 'corporation'
    corporation_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                               comment="公司id，公司仅用于显示信息，不提供登录功能")
    name = db.Column(db.String(255), unique=True, nullable=False, comment="公司名")
    registeredcapital = db.Column(db.Integer, comment="公司的注册资本")
    legalrepresentative = db.Column(db.String(255), comment="公司的法律代表人")
    registrationdate = db.Column(db.DateTime, default=datetime.now, comment="公司登记日期")
    tel = db.Column(db.String(255), comment="公司电话，多个电话用;分割")
    email = db.Column(db.String(255), comment="公司邮箱，多个邮箱用;分割")
    website = db.Column(db.String(255), comment="公司网址")
    location = db.Column(db.String(255), comment="公司地址")
    requirementinfo = db.Column(db.String(255), comment="公司招聘信息")
    structure = db.Column(db.Text, comment="公司架构，广义表形式")
    overall_depart = db.Column(db.String(255), comment="公司的全部部门，暂不使用，用;分割，部门不能包含分号")
    otherinfo = db.Column(db.String(255), comment="公司其他信息，比如签名")
    is_register = db.Column(db.Boolean, comment="公司是否审核通过，0表示正在审核")
    is_delete = db.Column(db.Boolean, comment="公司是否注销，1表示注销")

    def __init__(self, corporation_id, name, registeredcapital=0, legalrepresentative="",
                 registrationdate=datetime.now, tel="", email="", website="", structure="",
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
        self.structure = structure
        self.requirementinfo = requirementinfo
        self.otherinfo = otherinfo
        self.is_register = is_register
        self.is_delete = is_delete

    def save(self):
        db.session.add(self)
        db.session.commit()
