from flask import Blueprint, request, session, jsonify
from flaskapp.create_flask import app
from mysql.create_db import db
from models.recuritpost import Recruitpost
from models.person import Person
from models.applylist import Applylist
from tools.transform import idcard2ages
import tools.login_check as login_check
from models.stafftrack import Stafftrack
from models.corporation import Corporation
from models.performance import Performance
from models.rewardandpulishment import Rewardandpulishment
import json

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


@user_blueprint.route('/candidate', methods=['GET', 'POST'])
@login_check.is_admin_login
def candidate():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        user_id = request.values.get("user_id", "")
        if user_id == "":
            raise Exception("user_id must not be empty")

        retrieve_list_stafftrack = ["stafftrack_id", "corporation_id", "user_id",
                                   "arrivetime", "departtime", "dutytype", "description"]
        querylist_stafftrack = Stafftrack.get_obj(retrieve_list_stafftrack)
        msg = db.session.query(*querylist_stafftrack). \
            filter(Stafftrack.user_id == user_id)

        retrieve_list_corporation = ["corporation_id", "name", "registeredcapital", "legalrepresentative",
                         "registrationdate", "tel", "email", "website",
                         "location", "requirementinfo", "structure", "overall_depart",
                         "otherinfo", "is_register", "is_delete"]
        querylist_corporation = Corporation.get_obj(retrieve_list_corporation)


        retrieve_list_performance = ["performance_id", "corporation_id", "user_id",
                                     "hr_id", "value", "description", "registerdate",
                                     "department", "post"]
        querylist_performance = Performance.get_obj(retrieve_list_performance)
        


        retrieve_list_rewardandpulishment = \
            ["rnp_id", "corporation_id", "user_id", "user_name", "user_depart",
             "user_job", "hr_id", "rew_or_pun", "reward_pun_name", "description", "registerdate"]
        querylist_rewardandpulishment = Rewardandpulishment.get_obj(retrieve_list_rewardandpulishment)

        return_list = []
        for line in msg:
            struct = dict()
            corporation_id = line.corporation_id
            line = list(line)
            line[3] = line[3].strftime('%Y-%m-%d')
            line[4] = line[4].strftime('%Y-%m-%d')
            stafftrack_ret = dict(zip(retrieve_list_stafftrack, line))


            msg_cor = db.session.query(*querylist_corporation).\
                filter(Corporation.corporation_id == corporation_id).first()
            msg_cor = list(msg_cor)
            msg_cor[4] = msg_cor[4].strftime('%Y-%m-%d')
            stafftrack_ret = dict(zip(retrieve_list_corporation, msg_cor), **stafftrack_ret)
            struct["corporation"] = stafftrack_ret

            msg_per = db.session.query(*querylist_performance). \
                filter(Performance.user_id == user_id).\
                filter(Performance.corporation_id == corporation_id)
            return_msg_per = []
            for line_per in msg_per:
                line_per = list(line_per)
                line_per[6] = line_per[6].strftime('%Y-%m-%d')
                temp = dict(zip(retrieve_list_performance,line_per))
                return_msg_per.append(temp)
            struct["performance"] = return_msg_per

            msg_rnp = db.session.query(*querylist_rewardandpulishment). \
                filter(Rewardandpulishment.user_id == user_id). \
                filter(Rewardandpulishment.corporation_id == corporation_id)
            return_msg_rnp = []
            for line_per in msg_rnp:
                line_per = list(line_per)
                line_per[10] = line_per[10].strftime('%Y-%m-%d')
                temp = dict(zip(retrieve_list_rewardandpulishment, line_per))
                return_msg_rnp.append(temp)
            struct["rewardandpulishment"] = return_msg_rnp

            return_list.append(struct)

        return dict(
            status=0,
            message="success",
            data=return_list
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
