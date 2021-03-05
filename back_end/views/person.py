from flask import Blueprint, request, session
from flaskapp.create_flask import app
from models.person import Person
import tools.valid as valid
from mysql.create_db import db
"""
本程序包含以下路由：
/person/create, post方法, 创建员工
/person/retrieve, get方法, 检索员工
    /person/retrieve/all, 检索全部员工
/person/update, post方法, 修改信息
/person/delete, get方法, 删除信息
"""


blue_print_name = "/person"
person_blueprint = Blueprint(blue_print_name, __name__)

@person_blueprint.route('/create/', methods=['GET', 'POST'])
def create():
    """
    CRUD中的C，create操作，新增一个用户，要求方式为POST形式，用户被添加到Person表中
    其中username, password, name, identitycard为必填，其他判断内容详见代码
    :return: 字典形式，详情请看/views/demo.py介绍
    """
    if request.method == 'GET':
        return dict(
            status=0,
            message="method must be get",
            data="none"
        )
    try:
        # 获取用户填写的信息
        username = request.form.get('username')
        password = request.form.get('password')
        name = request.form.get('name')
        sex = request.form.get('sex')
        identitycard = request.form.get('identitycard')
        tags = request.form.get('tags')
        edubackground = request.form.get('edubackground')
        briefintro = request.form.get('briefintro')
        tel = request.form.get('tel')
        email = request.form.get('email')
        politicsstatus = request.form.get('politicsstatus')
        address = request.form.get('address')
        postcode = request.form.get('postcode')
        workaddress = request.form.get('workaddress')

        # 定义个变量来控制过滤用户填写的信息
        flag = True
        msg = ""
        # 必要信息为用户名、密码、姓名、身份证号
        if flag and not all([username, password, name, identitycard]):
            msg, flag = '必要信息不完整：用户名、密码、姓名、身份证号', False
        # 判断用户名是长度是否大于16
        if flag and len(username) > 20:
            msg, flag = '用户名长度不能大于20', False

        if flag:
            # 核对输入的用户是否已经被注册了
            u = Person.query.filter(Person.username == username).first()
            # 判断用户名是否已经存在
            if u:
                flag = False
                msg = '用户名已经存在'
        if flag:
            res = valid.checkIdcard(identitycard)
            # 判断身份证合法性
            if res != "验证通过!":
                flag = False
                msg = res

        # 如果上面的检查有任意一项没有通过就返回注册页面,并提示响应的信息
        if not flag:
            return dict(
                status=0,
                message=msg,
                data="none"
            )
        # 上面的验证全部通过后就开始创建新用户
        person = Person(username=username, password=username, name=name, sex=sex,
                        identitycard=identitycard, tags=tags, edubackground=edubackground,
                        briefintro=briefintro, tel=tel, email=email,
                        politicsstatus=politicsstatus, address=address,
                        postcode=postcode, workaddress=workaddress)
        # 保存注册的用户
        person.save()
        return dict(
            status=1,
            message="success",
            data="none"
        )
    except Exception as e:
        return dict(
            status=0,
            message="internal error:" + str(e),
            data="none"
        )

# 下面的函数正在测试
@person_blueprint.route('/retrieve/all', methods=['GET', 'POST'])
def insert():
    try:
        msg = db.session.query(Person.user_id, Person.name,).all()
    except Exception as e:
        msg = e
    return str(msg)

app.register_blueprint(blueprint=person_blueprint, url_prefix=blue_print_name)
