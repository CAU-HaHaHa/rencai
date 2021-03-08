from datetime import datetime
from mysql.create_db import db


class Rewardandpulishment(db.Model):
    __tablename__ = 'rewardandpulishment'
    rnp_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                       comment="重大信息奖罚记录表，id自动递增")
    corporation_id = db.Column(db.Integer, comment="该公司的id")
    user_id = db.Column(db.Integer, comment="被记录者的用户id")
    user_name = db.Column(db.Integer, comment="被记录者的用户名")
    user_depart = db.Column(db.Integer, comment="用户所属的部门")
    hr_id = db.Column(db.Integer, comment="记录内容的hr的id")
    value = db.Column(db.Integer, comment="评价值，整型数据")
    reward_num = db.Column(db.Integer, comment="奖励次数，整形数据")
    pulish_num = db.Column(db.Integer, comment="惩罚次数，整形数据")
    description = db.Column(db.Text, comment="描述信息")
    registerdate = db.Column(db.DateTime, default=datetime.now, comment="填写日期")

    def __init__(self, corporation_id, user_id, hr_id, value=0,
                 reward_num=0, pulish_num=0,
                 description="", registerdate=datetime.now):
        self.corporation_id = corporation_id
        self.user_id = user_id
        self.hr_id = hr_id
        self.value = value
        self.reward_num = reward_num
        self.pulish_num = pulish_num
        self.description = description
        self.registerdate = registerdate

    def save(self):
        db.session.add(self)
        db.session.commit()
