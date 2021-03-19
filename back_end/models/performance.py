from datetime import datetime
from mysql.create_db import db


class Performance(db.Model):
    __tablename__ = 'performance'
    performance_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                               comment="员工绩效记录表，递增型主键")
    corporation_id = db.Column(db.Integer, comment="员工所在的公司id")
    user_id = db.Column(db.Integer, comment="员工的用户id")
    hr_id = db.Column(db.Integer, comment="记录该绩效的hr的id")
    value = db.Column(db.Integer, comment="绩效数值，整数型")
    description = db.Column(db.Text, comment="绩效描述")
    registerdate = db.Column(db.DateTime, comment="绩效等级日期")
    department = db.Column(db.String(255), comment="员工部门")
    post = db.Column(db.String(255), comment="职位信息")

    name_register = dict(
        performance_id=performance_id,
        corporation_id=corporation_id,
        user_id=user_id,
        hr_id=hr_id,
        value=value,
        description=description,
        registerdate=registerdate,
        department=department,
        post=post
    )

    @staticmethod
    def get_obj(namelist):
        obj_list = []
        for name in namelist:
            obj = Performance.name_register.get(name, 0)
            if obj == 0:
                raise Exception("column name not found: " + name)
            obj_list.append(obj)
        return obj_list

    def __init__(self, corporation_id, user_id, hr_id, value=0,
                 description="", registerdate=0, department="", post=""):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.hr_id = hr_id
        self.value = value
        self.description = description
        if registerdate == 0:
            create_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.registerdate = create_time
        self.department = department
        self.post = post

    def save(self):
        db.session.add(self)
        db.session.commit()
