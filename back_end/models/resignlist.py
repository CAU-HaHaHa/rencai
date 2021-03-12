from datetime import datetime
from mysql.create_db import db


class Resignlist(db.Model):
    __tablename__ = 'resignlist'
    resignlist_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                              comment="用于记录用户辞职信息的表，id自动递增")
    user_id = db.Column(db.Integer, comment="辞职者用户id")
    description = db.Column(db.Text, comment="辞职信息描述")
    registerdate = db.Column(db.DateTime, default=datetime.now, comment="递交辞职信息的日期")

    name_register = dict(
        resignlist_id=resignlist_id,
        user_id=user_id,
        description=description,
        registerdate=registerdate
    )

    @staticmethod
    def get_obj(namelist):
        obj_list = []
        for name in namelist:
            obj = Resignlist.name_register.get(name, 0)
            if obj == 0:
                raise Exception("column name not found: " + name)
            obj_list.append(obj)
        return obj_list

    def __init__(self, user_id, description="",
                 registerdate=0):
        self.user_id = user_id
        self.description = description
        if registerdate == 0:
            create_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.registerdate = create_time

    def save(self):
        db.session.add(self)
        db.session.commit()
