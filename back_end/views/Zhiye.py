from flask import Blueprint, request, session
from flaskapp.create_flask import app
from mysql.create_db import db
from models.recuritpost import Recruitpost
from models.person import Person
from models.applylist import Applylist
from tools.transform import idcard2ages
import tools.login_check as login_check
import datetime

blue_print_name = "/Zhiye"
user_blueprint = Blueprint(blue_print_name, __name__)


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
            offer_out_of_date = line[6] + datetime.timedelta(hours=outofdate)

            if offer_out_of_date < datetime.datetime.now():
                line[5] = 3  # 表示过期
            del line[7]  # 删除重复的uid
            line[4] = line[4].strftime('%Y-%m-%d %H:%M:%S')
            line[6] = line[6].strftime('%Y-%m-%d %H:%M:%S')
            offer_out_of_date = offer_out_of_date.strftime('%Y-%m-%d %H:%M:%S')
            line.append(offer_out_of_date)
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
