from datetime import datetime
from mysql.create_db import db


class Recruitpost(db.Model):
    __tablename__ = 'recruitpost'
    recruitpost_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                               comment="招募信息表，id表示招募岗位的唯一标识，自动生成自动递增")
    corporation_id = db.Column(db.Integer, comment="招募公司id")
    department = db.Column(db.String(255), comment="招募岗位的部门")
    posttype = db.Column(db.String(255), comment="招募的岗位")
    number = db.Column(db.Integer, comment="招募岗位的数量")
    description = db.Column(db.Text, comment="招募信息描述")
    isposted = db.Column(db.Boolean, comment="是否公开该招募信息")
    registerdate = db.Column(db.DateTime, default=datetime.now, comment="招募公开日期")

    name_register = dict(
        recruitpost_id=recruitpost_id,
        corporation_id=corporation_id,
        department=department,
        posttype=posttype,
        number=number,
        description=description,
        isposted=isposted,
        registerdate=registerdate
    )

    @staticmethod
    def get_obj(namelist):
        obj_list = []
        for name in namelist:
            obj = Recruitpost.name_register.get(name, 0)
            if obj == 0:
                raise Exception("column name not found: " + name)
            obj_list.append(obj)
        return obj_list

    def __init__(self, corporation_id, department="", posttype="",
                 number=0, description="", isposted=1, registerdate=0):
        self.corporation_id = corporation_id
        self.department = department
        self.number = number
        self.isposted = isposted
        self.description = description
        self.posttype = posttype
        if registerdate == 0:
            create_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.registerdate = create_time

    def save(self):
        db.session.add(self)
        db.session.commit()
