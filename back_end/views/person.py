from flask import Blueprint, request, session, redirect
from flaskapp.create_flask import app
from models.person import Person
import tools.valid as valid
from mysql.create_db import db
from models.hr import Hr
from tools.mail.sendvalidcheck import Sendcheck

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

@person_blueprint.route('/sa_login', methods=['GET', 'POST'])
def sa_login():
    root_uid = request.form.get('username')
    root_pwd = request.form.get('password')
    if app.config['SERVER_INI']["root_uid"] == root_uid and \
        app.config['SERVER_INI']["root_pwd"] == root_pwd:
        session["user_type"] = 3
    return redirect("/")


@person_blueprint.route('/sa_logout', methods=['GET', 'POST'])
def sa_logout():
    session["user_type"] = 0
    return redirect("/")


@person_blueprint.route('/login/', methods=['GET', 'POST'])
def login():
    status = 0
    try:
        if request.method == "GET":
            raise Exception("method must be post")
        username = request.form.get('username')
        password = request.form.get('password')
        usertype = request.form.get('usertype')
        if not all([username, password, usertype]):
            raise Exception("username/password/usertype must not be empty")
        if usertype == "1":  # 这里是hr登录
            retrieve_list = ["hr_id", "corporation_id", "name", "sex",
                             "identitycard", "username", "password", ]
            querylist = Hr.get_obj(retrieve_list)
            msg = db.session.query(*querylist)
            have_user = msg.filter(Hr.username == username).first()
            if not have_user:
                status = 2
                raise Exception("user is not exist, please check your account")
            passcheck = msg.filter(Hr.username == username, Hr.password == password).first()
            if not passcheck:
                status = 3
                raise Exception("password error")
            session["user_id"] = have_user[0]
            session["user_type"] = 1
            return dict(
                status=1,
                message="success",
                data=dict(zip(retrieve_list, passcheck))
            )
            # 如果用户名和密码不一致返回登录页面,并给提示信息
        elif usertype == "2":  # 这里是person登录
            retrieve_list = ["user_id", "username", "password", "name", "sex",
                             "identitycard", "tags", "edubackground", "eduschool",
                             "briefintro", "tel", "email", "politicsstatus", "address",
                             "postcode", "workaddress"]
            querylist = Person.get_obj(retrieve_list)
            msg = db.session.query(*querylist)
            have_user = msg.filter(Person.username == username).first()
            if not have_user:
                status = 2
                raise Exception("user is not exist, please check your account")
            passcheck = msg.filter(Person.username == username, Person.password == password).first()
            if not passcheck:
                status = 3
                raise Exception("password error")
            session["user_id"] = have_user[0]
            session["user_type"] = 2
            return dict(
                status=1,
                message="success",
                data=dict(zip(retrieve_list, passcheck))
            )
        else:
            raise Exception("user type error: user type must be 1 for hr or 2 for staff")

    except Exception as e:
        return dict(
            status=status,
            message=str(e),
            data="none"
        )


@person_blueprint.route('/create', methods=['GET', 'POST'])
def create():
    status = 0
    try:
        if request.method == 'GET':
            raise Exception("method must be post")
        # 获取用户填写的信息
        username = request.form.get('username')
        password = request.form.get('password')
        tel = request.form.get('telephone')
        email = request.form.get('email')
        if not all([username, password, tel, email]):
            raise Exception('required information is not complete: username, password, tel, email')
        have_uid = Person.query.filter(Person.username == username).first()
        if have_uid:
            status = 2
            raise Exception('user name is exist')
        if not valid.checkEmail(email):
            raise Exception('email is not valid')
        if not valid.checkPhone(tel):
            raise Exception('phone number is not valid')

        config = app.config['SERVER_INI']
        config["to_mail"] = email
        sender = Sendcheck(config)
        emailcheck = sender.send()
        person = Person(username=username, password=username,
                        tel=tel, email=email, emailcheck=emailcheck)
        person.save()
        return dict(
            status=1,
            message="success",
            data="none"
        )
    except Exception as e:
        return dict(
            status=status,
            message=str(e),
            data="none"
        )


'''
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
            message="method must be post",
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
            raise Exception(msg)

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

'''
app.register_blueprint(blueprint=person_blueprint, url_prefix=blue_print_name)
