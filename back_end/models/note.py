from datetime import datetime
from mysql.create_db import db


class Note(db.Model):
    __tablename__ = 'note'
    note_id = db.Column(db.Integer, primary_key=True, autoincrement=True,
                        comment="用于记录hr对于用户发布的信息")
    user_id = db.Column(db.Integer, comment="接收信息者用户的id")
    corporation_id = db.Column(db.Integer, comment="发布信息公司的id")
    hr_id = db.Column(db.Integer, comment="发布信息的hr的id")
    description = db.Column(db.Text, comment="信息的主题内容")
    registerdate = db.Column(db.DateTime, default=datetime.now, comment="信息发布时间")

    name_register = dict(
        note_id=note_id,
        user_id=user_id,
        corporation_id=corporation_id,
        hr_id=hr_id,
        description=description,
        registerdate=registerdate
    )

    @staticmethod
    def get_obj(namelist):
        obj_list = []
        for name in namelist:
            obj = Note.name_register.get(name, 0)
            if obj == 0:
                raise Exception("column name not found: " + name)
            obj_list.append(obj)
        return obj_list


    def __init__(self, user_id, hr_id, corporation_id,
                 description="", registerdate=datetime.now):
        self.user_id = user_id
        self.hr_id = hr_id
        self.description = description
        self.corporation_id = corporation_id
        self.registerdate = registerdate

    def save(self):
        db.session.add(self)
        db.session.commit()
