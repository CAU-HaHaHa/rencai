"""
该模块做测试使用，可以删除

"""
from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db

from models.person import Person

blue_print_name = "/test"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/create/')
def create():
    db.create_all()
    return '创建成功'


@user_blueprint.route('/insert/')
def insert():
    person = Person(username="tt",password="ss")
    person.save()

    return '添加成功'


# 注意，这一步操作要放在程序的最后，因为程序要先执行前面的创建blueprint，才能把
# 蓝图等级到这里
app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
