from datetime import datetime
from mysql.create_db import db


class Hr(db.Model):
    __tablename__ = 'hr'
    hr_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                      comment="hr的账号id，唯一标识hr身份")
    corporation_id = db.Column(db.Integer, comment="hr所属的公司id")
    username = db.Column(db.String(255), unique=True, nullable=False, comment="hr账号用户名")
    password = db.Column(db.String(255), nullable=False, comment="登录密码")
    name = db.Column(db.String(255), comment="hr的姓名")
    sex = db.Column(db.Boolean, comment="hr性别，1表示男，0表示女")
    identitycard = db.Column(db.String(255), comment="hr的身份证信息")
    is_register = db.Column(db.Boolean, comment="hr注册是否过审，1表示过审")
    is_delete = db.Column(db.Boolean, comment="hr账号是否被注销，1表示注销状态")

    def __init__(self, username, password, corporation_id, name, sex=0,
                 identitycard="000000000000000000", is_register=0,
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
