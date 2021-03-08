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
    registerdate = db.Column(db.DateTime, default=datetime.now, comment="绩效等级日期")

    def __init__(self, corporation_id, user_id, hr_id, value=0,
                 description="", registerdate=datetime.now):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.hr_id = hr_id
        self.value = value
        self.description = description
        self.registerdate = registerdate

    def save(self):
        db.session.add(self)
        db.session.commit()
