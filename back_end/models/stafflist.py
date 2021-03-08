from datetime import datetime
from mysql.create_db import db


class Stafflist(db.Model):
    __tablename__ = 'stafflist'
    stafflist_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                             comment="员工信息记录，记录了所有使用该软件用户-公司键值对之间的关系")
    corporation_id = db.Column(db.Integer, comment="公司id")
    user_id = db.Column(db.Integer, comment="如果是用户，填写用户id")
    hr_id = db.Column(db.Integer, comment="如果是hr，填写hr的id")
    transferreason = db.Column(db.Text, comment="转入公司的原因")
    lastcorporation_id = db.Column(db.Integer, comment="上一家公司的id，没有则不写")
    hiredate = db.Column(db.DateTime, default=datetime.now, comment="录用日期")
    dutytype = db.Column(db.String(255), comment="职务信息，例：项目经理")
    department = db.Column(db.String(255), comment="部门信息，例如：市场部")
    jobnumber = db.Column(db.String(255), comment="岗位名称编号，eg：员工1")
    description = db.Column(db.String(255), comment="岗位招聘描述")

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
