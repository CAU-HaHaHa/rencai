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
    registrationdate = db.Column(db.DateTime, default=datetime.now, comment="发布时间")
    get_offer = db.Column(db.Integer, comment="用户是否接收到了offer，用于向用户反馈，"
                                              "0表示hr没看到，1表示接受，2表示拒绝")
    get_offer_date = db.Column(db.Integer, comment="用户接受到offer的日期")
    name_register = dict(
        applylist_id=applylist_id,
        recruitpost_id=recruitpost_id,
        user_id=user_id,
        description=description,
        registrationdate=registrationdate,
        get_offer=get_offer,
        get_offer_date=get_offer_date
    )

    @staticmethod
    def get_obj(namelist):
        obj_list = []
        for name in namelist:
            obj = Applylist.name_register.get(name, 0)
            if obj == 0:
                raise Exception("column name not found: " + name)
            obj_list.append(obj)
        return obj_list

    def __init__(self, recruitpost_id, user_id, description="",
                 registrationdate=0, get_offer=0, get_offer_date=0):
        self.recruitpost_id = recruitpost_id
        self.user_id = user_id
        self.description = description
        if registrationdate == 0:
            create_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.registrationdate = create_time
        if get_offer_date == 0:
            create_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.get_offer_date = create_time
        self.get_offer = get_offer

    def save(self):
        db.session.add(self)
        db.session.commit()
