from datetime import datetime
from mysql.create_db import db


class Rewardandpulishment(db.Model):
    __tablename__ = 'rewardandpulishment'
    rnp_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                       comment="重大信息奖罚记录表，id自动递增")
    corporation_id = db.Column(db.Integer, comment="该公司的id")
    user_id = db.Column(db.Integer, comment="被记录者的用户id")
    user_name = db.Column(db.String(255), comment="被记录者的用户名")
    user_depart = db.Column(db.String(255), comment="用户所属的部门")
    user_job = db.Column(db.String(255), comment="用户的工作")
    hr_id = db.Column(db.Integer, comment="记录内容的hr的id")
    rew_or_pun = db.Column(db.Boolean, comment="是否是奖励，0是惩罚，1是奖励")
    reward_pun_name = db.Column(db.String(255), comment="奖惩名称")
    description = db.Column(db.Text, comment="描述信息")
    registerdate = db.Column(db.DateTime, default=datetime.now, comment="奖罚时间")

    name_register = dict(
        rnp_id=rnp_id,
        corporation_id=corporation_id,
        user_id=user_id,
        user_name=user_name,
        user_depart=user_depart,
        user_job=user_job,
        hr_id=hr_id,
        rew_or_pun=rew_or_pun,
        reward_pun_name=reward_pun_name,
        description=description,
        registerdate=registerdate
    )

    @staticmethod
    def get_obj(namelist):
        obj_list = []
        for name in namelist:
            obj = Rewardandpulishment.name_register.get(name, 0)
            if obj == 0:
                raise Exception("column name not found: " + name)
            obj_list.append(obj)
        return obj_list

    def __init__(self, corporation_id, user_id, hr_id, user_name="", user_depart="",
                 user_job="", rew_or_pun=0, reward_pun_name="", description="", registerdate=0):

        self.corporation_id = corporation_id
        self.user_id = user_id
        self.user_name = user_name
        self.user_depart = user_depart
        self.user_job = user_job
        self.hr_id = hr_id
        self.rew_or_pun = rew_or_pun
        self.reward_pun_name = reward_pun_name
        self.description = description
        self.registerdate = registerdate
        if registerdate == 0:
            create_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.registerdate = create_time

    def save(self):
        db.session.add(self)
        db.session.commit()
