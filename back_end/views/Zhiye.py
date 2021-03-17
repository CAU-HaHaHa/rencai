from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.recuritpost import Recruitpost
from models.person import Person
from models.applylist import Applylist
from tools.transform import idcard2ages
import tools.login_check as login_check
import datetime
from models.stafflist import Stafflist

blue_print_name = "/Zhiye"
user_blueprint = Blueprint(blue_print_name, __name__)


@user_blueprint.route('/Myzhaopin/getoffer', methods=['GET', 'POST'])
@login_check.is_user_login
def Myzhaopin_getoffer():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        user_id = request.values.get("user_id")
        recruitpost_id = request.values.get("recruitpost_id")
        hr_id = request.values.get("hr_id")

        if not all([user_id, recruitpost_id]):
            raise Exception("user_id、recruitpost_id must not be empty")
        if not hr_id:
            hr_id = 0
        msg_al = Applylist.query.filter(Applylist.user_id == user_id,
                                        Applylist.recruitpost_id == recruitpost_id).first()
        if not msg_al:
            raise Exception("user_id and recruitpost_id composition is not a valid value")
        msg_al.get_offer = 4
        transferreason = msg_al.description

        retrieve_list_recuritpost = ["recruitpost_id", "corporation_id", "department",
                                     "posttype", "description"]
        querylist_recuritpost = Recruitpost.get_obj(retrieve_list_recuritpost)
        msg_rp = db.session.query(*querylist_recuritpost). \
            filter(Recruitpost.recruitpost_id == recruitpost_id).first()
        if not msg_rp:
            raise Exception("recruitpost_id is not available in recruitpost form")

        msg_user = db.session.query(Person.user_id, Person.name). \
            filter(Person.user_id == user_id).first()
        if not msg_user:
            raise Exception("user is not available in person form")

        msg_sl = db.session.query(Stafflist.user_id). \
            filter(Stafflist.user_id == user_id).first()
        if msg_sl:
            raise Exception("user is already in stafflist form")

        stafflist = Stafflist(
            corporation_id=msg_rp.corporation_id,
            user_or_hr=0,
            user_id=user_id,
            hr_id=hr_id,
            user_name=msg_user.name,
            transferreason=transferreason,
            dutytype=msg_rp.posttype,
            department=msg_rp.department,
            jobnumber=msg_rp.posttype,
            description=msg_rp.description
        )
        # db.session.commit()
        stafflist.save()

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


@user_blueprint.route('/Myzhaopin/isOK', methods=['GET', 'POST'])
@login_check.is_user_login
def Myzhaopin_isOK():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        user_id = request.values.get("user_id", "")
        if user_id == "":
            raise Exception("user_id must not be empty")

        msg = db.session.query(Stafflist.user_id). \
            filter(Stafflist.user_id == user_id).first()
        if msg:
            return_msg = 1
        else:
            return_msg = 0
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


@user_blueprint.route('/Myzhaopin/dataSource', methods=['GET', 'POST'])
@login_check.is_user_login
def Myzhaopin_dataSource():
    try:
        if request.method == "POST":
            raise Exception("method must be get")
        user_id = request.values.get("user_id", "")
        if user_id == "":
            raise Exception("user_id must not be empty")

        retrieve_list_applylist = ["applylist_id", "recruitpost_id", "user_id",
                                   "description", "registrationdate", "get_offer", "get_offer_date"]
        querylist_applylist = Applylist.get_obj(retrieve_list_applylist)
        retrieve_list_recruitpost = ["recruitpost_id", "corporation_id", "department",
                                     "posttype", "number", "description"]
        querylist_recruitpostt = Recruitpost.get_obj(retrieve_list_recruitpost)
        msg = db.session.query(*querylist_applylist, *querylist_recruitpostt). \
            filter(Applylist.user_id == user_id). \
            filter(Applylist.recruitpost_id == Recruitpost.recruitpost_id)

        retrieve_list = ["applylist_id", "recruitpost_id", "user_id",
                         "description", "registrationdate", "get_offer", "get_offer_date",
                         "corporation_id", "department", "posttype", "number", "description",
                         "offer_out_of_date"]
        return_msg = []
        outofdate = app.config['SERVER_INI'].get("getoffer_outofdate", "72")
        try:
            outofdate = int(outofdate)
        except:
            raise Exception("start ini getoffer_outofdate is not a int type")

        for line in msg:
            line = list(line)
            line[4] = line[4].strftime('%Y-%m-%d')
            del line[7]  # 删除重复的uid

            if line[5] == 1:
                offer_out_of_date = line[6] + datetime.timedelta(hours=outofdate)
                if offer_out_of_date < datetime.datetime.now():
                    line[5] = 3  # 表示过期
                line[6] = line[6].strftime('%Y-%m-%d %H:%M:%S')
                offer_out_of_date = offer_out_of_date.strftime('%Y-%m-%d %H:%M:%S')
                line.append(offer_out_of_date)
            else:
                line.append("")

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
