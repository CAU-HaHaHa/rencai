"""
该模块为quick start，快速入门代码示例，用于路由的截取与数据发送
demo内容会不断更新
"""
# 引入必要的库
from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
import tools.login_check as login_check

# 步骤1：定义blueprint名称，以斜杠开头，加上路径的名称
blue_print_name = "/demo"

# 创建一个blueprint，将所有的路由登记到以该蓝图为路径的子目录下，最后添加蓝图到app里
# 蓝图的添加要放在程序的结尾
user_blueprint = Blueprint(blue_print_name, __name__)


# 步骤2，定义访问路由，该路由对应的是"/demo/create_db"，将被调用下面的函数
@user_blueprint.route('/create_db/')
@login_check.is_admin_login
def create_db():
    """
    创建数据库（如果存在则不进行创建，创建的位置为models文件夹下的所以模型
    """
    try:
        # 这里数据库的操作使用db即可操作所有models中定义的数据库
        db.create_all()
        # 删除数据库会删除所有的数据，请谨慎使用下面的代码
        # db.drop_all()

    # 步骤3，定义返回信息的统一格式，以json形式返回，status为当前状态，
    # 0表示操作失败，1表示操作成功，其他情况请查看具体的函数说明
    # message表示原因，data表示返回的数据，具体的数据内容参见不同的函数给出的说明
    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none data"
        )
    return dict(
        status=0,
        message="successful",
        data="none data"
    )



# 步骤4：设置会话的变量方式（会话在用户使用浏览器打开的时候，根据用户的ip地址
# 和端口号被创建用于服务，在用户关闭浏览器之后，服务器端的tcp连接超时，
# 会话才会被自动断开，会话中所有的变量都可以保存在session中，session本质为
# python中的字典dict，与dict的操作一致）
@user_blueprint.route('/setvar/', methods=['GET'])
@login_check.is_admin_login
def setvar():
    """
    设置会话的变量
    """
    session["test_var"] = "this is a string"
    return "test_var 设置成功"


@user_blueprint.route('/getvar/', methods=['GET'])
@login_check.is_admin_login
def getvar():
    """
    测试会话的变量
    """
    var = session.get("test_var", 0)
    if var == 0:
        return "没有变量"
    return "test_var 为" + var


# 步骤5：判断用户的访问请求是GET还是POST，并作出不同的反馈
@user_blueprint.route('/getpost/', methods=['GET', 'POST'])
@login_check.is_admin_login
def getpost():
    if request.method == "GET":
        return 'get method'
    if request.method == "POST":
        return 'post method'


# 注意，这一步操作要放在程序的最后，因为程序要先执行前面的创建blueprint，才能把
# 蓝图登记到这里
app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
