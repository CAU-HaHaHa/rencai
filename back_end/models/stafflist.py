from datetime import datetime
from mysql.create_db import db


class Stafflist(db.Model):
    __tablename__ = 'stafflist'
    stafflist_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                             comment="员工信息记录，记录了所有使用该软件用户-公司键值对之间的关系")
    corporation_id = db.Column(db.Integer, comment="公司id")
    user_or_hr = db.Column(db.Boolean, comment="用户0，hr是1")
    user_id = db.Column(db.Integer, comment="如果是用户，填写用户id")
    hr_id = db.Column(db.Integer, comment="如果是hr，填写hr的id")
    user_name = db.Column(db.String(255), comment="用户姓名")
    transferreason = db.Column(db.Text, comment="转入公司的原因")
    lastcorporation_id = db.Column(db.Integer, comment="上一家公司的id，没有则不写")
    hiredate = db.Column(db.DateTime, default=datetime.now, comment="录用日期")
    dutytype = db.Column(db.String(255), comment="职务信息，例：项目经理")
    department = db.Column(db.String(255), comment="部门信息，例如：市场部")
    jobnumber = db.Column(db.String(255), comment="岗位名称编号，eg：员工1")
    description = db.Column(db.String(255), comment="岗位招聘描述")

    name_register = dict(
        stafflist_id=stafflist_id,
        corporation_id=corporation_id,
        user_or_hr=user_or_hr,
        user_id=user_id,
        hr_id=hr_id,
        user_name=user_name,
        transferreason=transferreason,
        lastcorporation_id=lastcorporation_id,
        hiredate=hiredate,
        dutytype=dutytype,
        department=department,
        jobnumber=jobnumber,
        description=description
    )

    @staticmethod
    def get_obj(namelist):
        obj_list = []
        for name in namelist:
            obj = Stafflist.name_register.get(name, 0)
            if obj == 0:
                raise Exception("column name not found: " + name)
            obj_list.append(obj)
        return obj_list

    def __init__(self, corporation_id, user_id, hr_id, user_or_hr="", user_name="",
                 transferreason="", lastcorporation_id=0, hiredate=0,
                 dutytype="", department="", jobnumber="", description=""):
        self.corporation_id = corporation_id
        self.user_or_hr = user_or_hr
        self.user_id = user_id
        self.hr_id = hr_id
        self.user_name = user_name
        self.transferreason = transferreason
        self.lastcorporation_id = lastcorporation_id
        if hiredate == 0:
            create_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.hiredate = create_time
        self.dutytype = dutytype
        self.department = department
        self.jobnumber = jobnumber
        self.description = description

    def save(self):
        db.session.add(self)
        db.session.commit()
