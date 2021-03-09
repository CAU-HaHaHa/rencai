import os
import mysql.mysql_config as mysql_config
from mysql.create_db import db
from flaskapp.create_flask import app
from tools.readini import get_server_ini

def create_app(sever_ini):
    # 加载mysql配置文件
    app.config.from_object(mysql_config)

    # 设置执行sql语句不产生警告提示
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JSON_AS_ASCII'] = False
    # db初始化flask
    # db的操作要在flask服务器运行状态下才可以执行，因为db的操作需要上下文支持
    db.init_app(app)

    # 导入所有models中的数据库模型
    import_models(baselocation="models")

    # 导入所有views中的路由视图
    import_views(baselocation="views")

    # 设置session密钥
    app.config['SECRET_KEY'] = 'secret_key'

    # 设置服务器配置
    app.config['SERVER_INI'] = get_server_ini(sever_ini)



    return app


def import_models(baselocation="models"):
    for i in os.listdir(baselocation):
        if os.path.splitext(i)[1] == ".py":
            __import__(baselocation + "." + os.path.splitext(i)[0])


def import_views(baselocation="views"):
    for i in os.listdir(baselocation):
        if os.path.splitext(i)[1] == ".py":
            __import__(baselocation + "." + os.path.splitext(i)[0])
