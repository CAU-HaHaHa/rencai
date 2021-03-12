from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.recuritpost import Recruitpost
from models.person import Person
from models.applylist import Applylist
from tools.transform import idcard2ages
import tools.login_check as login_check

blue_print_name = "/rencai"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/enroll', methods=['GET', 'POST'])
@login_check.is_admin_login
def enroll():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        applylist_id = request.values.get("applylist_id", "")
        if applylist_id == "":
            raise Exception("applylist_id must not be empty")
        msg = Applylist.query.filter(Applylist.applylist_id == applylist_id).first()
        if not msg:
            raise Exception("applylist_id does not be exist")
        msg.get_offer = 1
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


@user_blueprint.route('/refuse', methods=['GET', 'POST'])
@login_check.is_admin_login
def refuse():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        applylist_id = request.values.get("applylist_id", "")
        if applylist_id == "":
            raise Exception("applylist_id must not be empty")
        msg = Applylist.query.filter(Applylist.applylist_id == applylist_id).first()
        if not msg:
            raise Exception("applylist_id does not be exist")
        msg.get_offer = 2
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


@user_blueprint.route('/recruitpost_candidate', methods=['GET', 'POST'])
@login_check.is_admin_login
def recruitpost_candidate():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        recruitpost_id = request.values.get("recruitpost_id", "")
        if recruitpost_id == "":
            raise Exception("recruitpost_id must not be empty")

        retrieve_list_applylist = ["applylist_id", "recruitpost_id", "user_id",
                                   "description", "registrationdate", "get_offer"]
        querylist_applylist = Applylist.get_obj(retrieve_list_applylist)
        retrieve_list_person = ["user_id", "username", "sex", "identitycard",
                                "edubackground", "eduschool", "tel", "briefintro",
                                "email", "address", "politicsstatus", "postcode", "name"]
        querylist_person = Person.get_obj(retrieve_list_person)
        msg = db.session.query(*querylist_applylist, *querylist_person). \
            filter(Applylist.recruitpost_id == recruitpost_id). \
            filter(Applylist.get_offer == 0). \
            filter(Applylist.user_id == Person.user_id).all()

        retrieve_list = ["applylist_id", "recruitpost_id", "user_id",
                         "description", "registrationdate", "username",
                         "sex", "age",
                         "edubackground", "eduschool", "tel", "briefintro",
                         "email", "address", "politicsstatus", "postcode", "name"]
        return_msg = []
        for line in msg:
            line = list(line)
            line[4] = line[4].strftime('%Y-%m-%d')  # 日期项
            if line[8] == 1:
                line[8] = "男"
            else:
                line[8] = "女"
            line[9] = str(idcard2ages(line[9]))  # 转换年龄

            del line[5:7]  # 删除重复的uid
            line[10] = str(line[10]).strip(";")  # 电话号码处理
            temp = zip(retrieve_list, line)
            return_msg.append(dict(temp))
        return dict(
            status=1,
            message="success",
            data=return_msg
        )

    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


@user_blueprint.route('/show', methods=['GET', 'POST'])
@login_check.is_admin_login
def show():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        corporation_id = request.values.get("corporation_id", "")
        if corporation_id == "":
            raise Exception("corporation_id must not be empty")
        retrieve_list = ["recruitpost_id", "corporation_id", "department",
                         "posttype", "number", "description", "isposted",
                         "registerdate"]
        querylist = Recruitpost.get_obj(retrieve_list)
        msg = db.session.query(*querylist). \
            filter(Recruitpost.isposted == 1, Recruitpost.corporation_id == corporation_id)
        return_msg = []
        for line in msg:
            line = list(line)
            line[7] = line[7].strftime('%Y-%m-%d')
            temp = zip(retrieve_list, line)
            return_msg.append(dict(temp))
        return dict(
            status=1,
            message="success",
            data=return_msg
        )
    except Exception as e:
        return dict(
            status=0,
            message=str(e),
            data="none"
        )


app.register_blueprint(blueprint=user_blueprint, url_prefix=blue_print_name)
