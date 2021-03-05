"""
该模块为quick start，快速入门代码示例，用于建立数据库模型
demo内容会不断更新
"""

from datetime import datetime
from mysql.create_db import db


class Demo(db.Model):
    # 新建数据表的名称
    __tablename__ = 'demo'
    # 新建数据表的数据项
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def __init__(self, id):
        self.id = id

    def save(self):
        """
        该函数用于插入，插入数据的对象必须为继承db.Model的对象
        注：不用拘泥于save函数写法，可以一次在db的session中添加多个对象，一次性提交
        :return:
        """
        db.session.add(self)
        db.session.commit()
