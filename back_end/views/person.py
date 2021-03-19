from flask import Blueprint, request, session, redirect
from flaskapp.create_flask import app
from models.person import Person
import tools.valid as valid
from mysql.create_db import db
from models.hr import Hr
from models.stafflist import Stafflist
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
                             "identitycard", "username", "password", "is_register"]
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
            if passcheck.is_register == 0:
                status = 4
                raise Exception("hr account is checking now, please waiting")
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

            passcheck = list(passcheck)
            if passcheck[4] == 1:
                passcheck[4] = "男"
            else:
                passcheck[4] = "女"
            passcheck[10] = passcheck[10].strip(";")
            return_data = dict(zip(retrieve_list, passcheck))
            msg = db.session.query(Stafflist.user_id, Stafflist.corporation_id).\
                filter(Stafflist.user_id == have_user[0]).first()
            if msg:
                return_data["corporation_id"] = msg[1]
            else:
                return_data["corporation_id"] = 0

            return dict(
                status=1,
                message="success",
                data=return_data
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
        person = Person(username=username, password=password,
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


@person_blueprint.route('/update', methods=['GET', 'POST'])
def update():
    try:
        if request.method == 'GET':
            raise Exception("method must be post")
        # 获取用户填写的信息
        user_id = request.form.get('userid')
        name = request.form.get('name')
        sex = request.form.get('sex')
        identitycard = request.form.get('identitycard')
        politicsstatus = request.form.get('politicsstatus')
        edubackground = request.form.get('edubackground')
        eduschool = request.form.get('eduschool')
        tel = request.form.get('tel')
        email = request.form.get('email')
        address = request.form.get('address')
        postcode = request.form.get('postcode')
        briefintro = request.form.get('briefintro')

        if not user_id:
            raise Exception("userid must not be empty")

        msg_per = Person.query.filter(Person.user_id == user_id).first()
        if not msg_per:
            raise Exception("userid is not exist")
        if name:
            msg_per.name = name
        if sex:
            if sex == "男":
                msg_per.sex = 1
            elif sex == "女":
                msg_per.sex = 0
            else:
                raise Exception("sex must be 男 or 女")
        if identitycard:
            if valid.checkIdcard(identitycard) != "验证通过!":
                raise Exception("id card is not valid")
            msg_per.identitycard = identitycard
        if politicsstatus:
            msg_per.politicsstatus = politicsstatus
        if edubackground:
            msg_per.edubackground = edubackground
        if eduschool:
            msg_per.eduschool = eduschool
        if email:
            if not valid.checkEmail(email):
                raise Exception("email is not valid")
            msg_per.email = email
        if address:
            msg_per.address = address
        if postcode:
            msg_per.postcode = postcode
        if tel:
            if not valid.checkPhone(tel):
                raise Exception("phone is not valid")
            msg_per.tel = tel
        if briefintro:
            msg_per.briefintro = briefintro

        db.session.commit()

        return dict(
            status=1,
            message="success",
            data="none"
        )

    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


app.register_blueprint(blueprint=person_blueprint, url_prefix=blue_print_name)
