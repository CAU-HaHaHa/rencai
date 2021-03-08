from datetime import datetime
from mysql.create_db import db


class Checkingin(db.Model):
    __tablename__ = 'checkingin'
    checkingin_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                              comment="用户签到情况表")
    corporation_id = db.Column(db.Integer, comment="用户目前的公司id")
    user_id = db.Column(db.Integer, comment="用户id")
    recordmonth = db.Column(db.Integer, comment="记录月份，时间戳形式，2020年1月为第一个月")
    record = db.Column(db.String(255), comment="编码形式，长度31，每个位代表一天，"
                                               "0表示缺勤，1表示签到，2表示迟到")

    def __init__(self, corporation_id, user_id,
                 recordmonth=0, record="0000000000000000000000000000000"):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.recordmonth = recordmonth
        self.record = record

    def save(self):
        db.session.add(self)
        db.session.commit()
