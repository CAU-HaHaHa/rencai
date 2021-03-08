from datetime import datetime
from mysql.create_db import db


class Applylist(db.Model):
    __tablename__ = 'applylist'
    applylist_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                             comment="用户申请表，用于记录用户对于招募岗位的申请以及是否接收到offer")
    recruitpost_id = db.Column(db.Integer, nullable=False,
                               comment="招募信息id，用于唯一确定招募项目")
    user_id = db.Column(db.Integer, nullable=False, comment="职位申请者的id")
    description = db.Column(db.String(255), comment="申请陈述")
    description = db.Column(db.String(255), comment="申请陈述")
    registrationdate = db.Column(db.DateTime, default=datetime.now, comment="发布时间")
    get_offer = db.Column(db.Integer, comment="用户是否接收到了offer，用于向用户反馈，"
                                              "0表示hr没看到，1表示接受，2表示拒绝")

    def __init__(self, recruitpost_id, user_id, description="",
                 registrationdate=datetime.now, get_offer=0):
        self.recruitpost_id = recruitpost_id
        self.user_id = user_id
        self.description = description
        self.registrationdate = registrationdate
        self.get_offer = get_offer

    def save(self):
        db.session.add(self)
        db.session.commit()
