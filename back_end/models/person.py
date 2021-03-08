from datetime import datetime
from mysql.create_db import db


class Person(db.Model):
    __tablename__ = 'person'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                        comment="用户的id，递增，自动生成")
    username = db.Column(db.String(255), unique=True, nullable=False, comment="用户名")
    password = db.Column(db.String(255), nullable=False, comment="密码")
    name = db.Column(db.String(255), comment="用户真实姓名")
    sex = db.Column(db.Boolean, comment="用户性别，1表示男，0表示女")
    identitycard = db.Column(db.String(255), comment="用户身份证")
    tags = db.Column(db.String(255), comment="用户标签，比如：经理、计算机、生物、化学")
    edubackground = db.Column(db.String(255), comment="用户学历")
    eduschool = db.Column(db.String(255), comment="用户毕业的最高学历的学校")
    briefintro = db.Column(db.String(255), comment="用户自我简介")
    tel = db.Column(db.String(255), comment="用户电话，只能有一个")
    email = db.Column(db.String(255), comment="用户邮箱，只能记录一个")
    politicsstatus = db.Column(db.String(255), comment="用户政治背景，0为群众，1为共产党员，"
                                                       "2为预备党员，3为共青团员，4为其他")
    address = db.Column(db.String(255), comment="用户家庭住址")
    postcode = db.Column(db.String(255), comment="用户家庭住址邮编")
    workaddress = db.Column(db.String(255), comment="用户工作地址，记录GPS地址，方便打卡比较位置")

    name_register = dict(
        user_id=user_id,
        username=username,
        password=password,
        name=name,
        sex=sex,
        identitycard=identitycard,
        tags=tags,
        edubackground=edubackground,
        briefintro=briefintro,
        tel=tel,
        email=email,
        politicsstatus=politicsstatus,
        address=address,
        postcode=postcode,
        workaddress=workaddress
    )

    @staticmethod
    def get_obj(namelist):
        obj_list = []
        for name in namelist:
            obj = Person.name_register.get(name, 0)
            if obj == 0:
                raise Exception("column name not found: " + name)
            obj_list.append(obj)
        return obj_list

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
