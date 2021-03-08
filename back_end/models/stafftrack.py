from datetime import datetime
from mysql.create_db import db


class Stafftrack(db.Model):
    __tablename__ = 'stafftrack'
    stafftrack_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                              comment="记录用户历史的职位轨迹表，只有用户辞职后才会被记录这个表")
    corporation_id = db.Column(db.Integer, comment="用户所在过的公司的id")
    user_id = db.Column(db.Integer, comment="用户的id")
    arrivetime = db.Column(db.DateTime, default=datetime.now, comment="用户入职时间")
    departtime = db.Column(db.DateTime, default=datetime.now, comment="用户离职时间")
    dutytype = db.Column(db.String(255), comment="用户的在职时期的职位类型")
    description = db.Column(db.String(255), comment="基本描述信息")

    def __init__(self, corporation_id, user_id,
                 arrivetime=datetime.now, departtime=datetime.now,
                 dutytype="", description=""):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.arrivetime = arrivetime
        self.departtime = departtime
        self.dutytype = dutytype
        self.description = description

    def save(self):
        db.session.add(self)
        db.session.commit()
